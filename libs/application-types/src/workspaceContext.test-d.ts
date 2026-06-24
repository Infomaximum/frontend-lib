import { type IApplicationProps } from "./index";
import {
  type IWorkspaceContext,
  type ITableData,
  type ITableColumnInfo,
  type IScriptRun,
  type IScriptRunStatus,
  type IScriptRunResult,
  type IScriptExecution,
  type IIntegrationDetails,
} from "./workspaceContext";

// workspaceContext опционален и имеет нужную форму
const props: IApplicationProps = {
  language: "ru",
  isDebugMode: false,
  hasPackageWriteAccessChecker: () => true,
  appRouter: { basePath: "/", route: "/", navigateApp: () => {} },
  workspaceContext: {
    workspaceGuid: 1,
    isAvailable: true,
    resources: {},
  },
};
const ctx: IWorkspaceContext | undefined = props.workspaceContext;
void ctx;

// resources-группы опциональны — пустой объект валиден
const empty: IApplicationProps["workspaceContext"] = {
  workspaceGuid: 2,
  isAvailable: false,
  resources: {},
};
void empty;

// группа ресурса опциональна, но её методы — required (getData/run/...)
async function useResources(ctx: IWorkspaceContext) {
  const { tables, scripts, integrations } = ctx.resources;

  // tables.getData: колоночный контракт, paging опционален
  const tableData: ITableData | undefined = await tables?.getData({
    tableName: "orders",
    paging: { limit: 100 },
  });
  void tableData;

  // tables.getColumns: метаданные колонок без значений
  const columns: ITableColumnInfo[] | undefined = await tables?.getColumns("orders");
  void columns;

  // scripts: run возвращает scriptId, getStatus/getResult — по id
  const run: IScriptRun | undefined = await scripts?.run("script-guid", "payload");
  const runNoData: IScriptRun | undefined = await scripts?.run("script-guid");
  const status: IScriptRunStatus | undefined = await scripts?.getStatus(1);
  const result: IScriptRunResult | undefined = await scripts?.getResult(2);
  void run;
  void runNoData;
  void status;
  void result;

  // scripts: история выполнений и остановка
  const executions: IScriptExecution[] | undefined = await scripts?.listExecutions(1, {
    paging: { limit: 10 },
  });
  const stopped: void | undefined = await scripts?.stop(1);
  void executions;
  void stopped;

  // integrations.get: интеграция с блоками
  const integration: IIntegrationDetails | undefined = await integrations?.get(7);
  void integration;
}
void useResources;
