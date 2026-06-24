/** Параметры постраничной выборки ресурса. */
export interface IWorkspaceResourcePaging {
  limit?: number;
  offset?: number;
}

/** Таблица пространства (элемент списка). */
export interface ITableInfo {
  name: string;
  involved: boolean;
}

/** Колонка данных таблицы. Бэкенд отдаёт данные поколоночно. */
export interface ITableColumn {
  name: string;
  dataType?: string;
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
  list(params?: { textFilter?: string; paging?: IWorkspaceResourcePaging }): Promise<ITableInfo[]>;
  /** Чтение данных таблицы по имени с учётом RLS и прав пользователя.
   *  Ограничение фазы: только постраничное чтение (limit); произвольный
   *  фильтр/сортировка/offset — следующая фаза (новый бэк-запрос). */
  getData(request: ITableDataRequest): Promise<ITableData>;
}

/** Скрипт пространства (элемент списка). */
export interface IScriptInfo {
  id: number;
  name: string;
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
  /** Результат исполнения скрипта по id исполнения. */
  getResult(executionId: number): Promise<IScriptRunResult>;
}

/** Подключение пространства (элемент списка). */
export interface IConnectionInfo {
  id: number;
  name: string;
  type: string;
}
export interface IConnectionsApi {
  list(): Promise<IConnectionInfo[]>;
}

/** Интеграция пространства (элемент списка). */
export interface IIntegrationInfo {
  id: number;
  name: string;
  guid: string;
}
export interface IIntegrationsApi {
  list(): Promise<IIntegrationInfo[]>;
}

/**
 * API доступа к ресурсам пространства. Группа присутствует только если её
 * модуль-владелец зарегистрировал фабрику. Контракт вводится инкрементально —
 * методы добавляются вместе с реализующими их фабриками (полная целевая
 * поверхность — в дизайн-спеке). Сейчас реализуются list-операции 4 ресурсов,
 * чтение данных таблиц (tables.getData) и управление скриптами
 * (scripts.run/getStatus/getResult); fileStorage, интеграции/подключения за
 * пределами list — следующие фазы (бэк-схема, гейт MS-950).
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
