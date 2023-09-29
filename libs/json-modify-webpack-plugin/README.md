### Installation

```sh
yarn add @infomaximum/json-modify-webpack-plugin
```

## Usage

```js
const { JsonModifyWebpackPlugin } = require("./plugin");
const PackageJSON = require("./package.json");

const webpackConfig = {
    entry: [
        "./src/index.js",
        "./manifest.json"
    ],
    output: {
        path: path.resolve("build"),
        filename: packageFilename,
        clean: true,
    },
    plugins: [
        new JsonModifyWebpackPlugin({
            matchers: [
                {
                matcher: /^manifest.json$/,
                action: (currentJsonContent) => {
                    currentJsonContent.version = PackageJSON.version;

                    return currentJsonContent;
                },
                },
            ],
        }),
    ];
}
```
