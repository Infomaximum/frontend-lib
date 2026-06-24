/** Параметры постраничной выборки ресурса. */
export interface IWorkspaceResourcePaging {
  limit?: number;
  offset?: number;
}

/** Таблица пространства (элемент списка). */
export interface ITableInfo {
  name: string;
  involved: boolean;
  id?: number;
  description?: string;
  /** Количество строк в таблице. */
  linesCount?: number;
  /** Количество колонок. */
  columnsCount?: number;
  /** Включён row-level security. */
  rls?: boolean;
  belongsPackage?: boolean;
}

/** Метаданные колонки таблицы (без значений). */
export interface ITableColumnInfo {
  name: string;
  dataType?: string;
  comment?: string;
}

/** Колонка данных таблицы. Бэкенд отдаёт данные поколоночно. */
export interface ITableColumn extends ITableColumnInfo {
  values: string[];
}

/** Запрос данных таблицы. */
export interface ITableDataRequest {
  tableName: string;
  paging?: IWorkspaceResourcePaging; // сейчас поддерживается только limit
}

/** Данные таблицы в колоночном представлении. */
export interface ITableData {
  columns: ITableColumn[];
}

export interface ITablesApi {
  list(params?: {
    textFilter?: string;
    paging?: IWorkspaceResourcePaging;
  }): Promise<ITableInfo[]>;
  /** Чтение данных таблицы по имени с учётом RLS и прав пользователя.
   *  Ограничение фазы: только постраничное чтение (limit); произвольный
   *  фильтр/сортировка/offset — следующая фаза (новый бэк-запрос). */
  getData(request: ITableDataRequest): Promise<ITableData>;
  /** Метаданные колонок таблицы (имя, тип, комментарий) без значений. */
  getColumns(tableName: string): Promise<ITableColumnInfo[]>;
}

/** Скрипт пространства (элемент списка). */
export interface IScriptInfo {
  id: number;
  name: string;
  /** Статический идентификатор скрипта — используется для run(). */
  guid: string;
  description?: string;
  /** Скрипт включён (активен по расписанию/триггеру). */
  enabled?: boolean;
  /** Скрипт сейчас выполняется. */
  isRunning?: boolean;
  /** Ключ скрипта. */
  key?: string;
  /** Количество активных выполнений. */
  activeExecutionsCount?: number;
}

/** Элемент истории выполнений скрипта. */
export interface IScriptExecution {
  /** id исполнения — передаётся в getResult. */
  id: number;
  status: string;
  error?: string;
}

/** Результат инициирования запуска скрипта. */
export interface IScriptRun {
  scriptId: number; // execute-мутация возвращает id скрипта
}

/** Статус исполнения скрипта. */
export interface IScriptRunStatus {
  status: string;
  isRunning: boolean;
}

/** Результат исполнения скрипта. */
export interface IScriptRunResult {
  status: string;
  data?: string;
  error?: string;
}

export interface IScriptsApi {
  list(params?: { paging?: IWorkspaceResourcePaging }): Promise<IScriptInfo[]>;
  /** Инициировать запуск скрипта по guid с опциональными данными. */
  run(scriptGuid: string, data?: string): Promise<IScriptRun>;
  /** Статус последнего исполнения скрипта по его id.
   *  Ограничение фазы: трекинг по последнему исполнению (racy при
   *  конкурентных запросах) — точный per-run трекинг требует доработки бэка. */
  getStatus(scriptId: number): Promise<IScriptRunStatus>;
  /** История выполнений скрипта (новые сверху). Даёт id исполнения для getResult. */
  listExecutions(
    scriptId: number,
    params?: { paging?: IWorkspaceResourcePaging },
  ): Promise<IScriptExecution[]>;
  /** Результат исполнения скрипта по id исполнения. */
  getResult(executionId: number): Promise<IScriptRunResult>;
  /** Остановить все выполнения скрипта. */
  stop(scriptId: number): Promise<void>;
}

/** Подключение пространства (элемент списка). */
export interface IConnectionInfo {
  id: number;
  name: string;
  type: string;
  /** Подключение полностью настроено. */
  configured?: boolean;
  belongsPackage?: boolean;
}
export interface IConnectionsApi {
  list(): Promise<IConnectionInfo[]>;
}

/** Блок (действие) пользовательской интеграции. */
export interface IIntegrationBlock {
  id: number;
  name: string;
  guid: string;
  type?: string;
  /** Ключ обращения к блоку интеграции. */
  key?: string;
  description?: string;
}

/** Интеграция пространства (элемент списка). */
export interface IIntegrationInfo {
  id: number;
  name: string;
  guid: string;
  description?: string;
  version?: string;
  belongsPackage?: boolean;
}

/** Интеграция с детализацией (блоки/действия). */
export interface IIntegrationDetails extends IIntegrationInfo {
  blocks: IIntegrationBlock[];
}

export interface IIntegrationsApi {
  list(): Promise<IIntegrationInfo[]>;
  /** Интеграция по id с её блоками (действиями). Вызов действия — за бэком (MS-950). */
  get(integrationId: number): Promise<IIntegrationDetails>;
}

/**
 * API доступа к ресурсам пространства. Группа присутствует только если её
 * модуль-владелец зарегистрировал фабрику. Контракт вводится инкрементально —
 * методы добавляются вместе с реализующими их фабриками.
 * Реализовано: tables (list/getData/getColumns), scripts (list/run/getStatus/
 * listExecutions/getResult/stop), connections (list), integrations (list/get).
 * Вне контракта (гейт MS-950): fileStorage, connections.use, integrations.invoke.
 */
export interface IWorkspaceResources {
  tables?: ITablesApi;
  scripts?: IScriptsApi;
  connections?: IConnectionsApi;
  integrations?: IIntegrationsApi;
}

/** Контекст привязанного к приложению пространства. */
export interface IWorkspaceContext {
  /** GUID привязанного пространства. */
  workspaceGuid: number;
  /** false → привязка разорвана / пространство в корзине / нет прав. */
  isAvailable: boolean;
  /** API доступа к ресурсам пространства. */
  resources: IWorkspaceResources;
}
