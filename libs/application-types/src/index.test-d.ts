import { type IApplicationProps, type IWorkspaceContext } from "./index";

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
