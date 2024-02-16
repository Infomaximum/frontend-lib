import { validate } from "schema-utils";
import type { Schema } from "schema-utils/declarations/validate";
import type { Compiler } from "webpack";

export type JsonModifyWebpackPluginOptions = {
  matchers: {
    matcher: RegExp;
    action: (json: Record<string, any>) => Record<string, any>;
  }[];
};

const schema = {
  type: "object",
  properties: {
    matchers: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          matcher: {
            instanceof: "RegExp",
          },
          action: {
            instanceof: "Function",
          },
        },
      },
    },
  },
} satisfies Schema;

function isRunAction(matcher: RegExp, assetKey: string) {
  return matcher.test(assetKey);
}

function stringify(
  obj: Record<string, any>,
  indent: string | number = 2,
  newline: string | undefined
) {
  const lf = "\n";
  const crlf = "\r\n";

  const jsonStr = JSON.stringify(obj, null, indent);

  if (newline === crlf) return jsonStr.replace(/\n/g, crlf) + crlf;

  return jsonStr + lf;
}

class JsonModifyWebpackPlugin {
  matchers: JsonModifyWebpackPluginOptions["matchers"];

  constructor(options: JsonModifyWebpackPluginOptions) {
    validate(schema, options, {
      name: JsonModifyWebpackPlugin.name,
      baseDataPath: "options",
    });

    this.matchers = options.matchers || [];
  }

  apply(compiler: Compiler) {
    const matchers = this.matchers;

    const {
      sources: { RawSource },
      Compilation,
    } = compiler.webpack;

    compiler.hooks.compilation.tap(JsonModifyWebpackPlugin.name, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: JsonModifyWebpackPlugin.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        async (assets) => {
          const detectIndent = (await import("detect-indent")).default;
          const { detectNewline } = await import("detect-newline");

          for (const assetKey in assets) {
            const asset = assets[assetKey];

            matchers
              .filter((matcher) => isRunAction(matcher.matcher, assetKey))
              .forEach((matcher) => {
                const source = asset.source().toString();

                const indent = detectIndent(source).indent;
                const newline = detectNewline(source);

                const json = JSON.parse(source);

                const newContent = stringify(matcher.action(json), indent, newline);

                compilation.updateAsset(assetKey, new RawSource(newContent));
              });
          }
        }
      );
    });
  }
}

export { JsonModifyWebpackPlugin };
