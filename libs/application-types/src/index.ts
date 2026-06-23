/// <reference types="@infomaximum/global-types" />

import { type TFilterDescriptions } from "@infomaximum/custom-filter";

/**
 * API роутинга кастомного приложения. Приложение управляет своим роутом через
 * `navigateApp` (платформа пишет путь в URL → ссылки шарабельны, работают
 * back/forward), а текущий путь получает в `route` на каждый `update`. Свою
 * `history`/`BrowserRouter` приложение НЕ использует — единственный источник
 * истины по URL — платформа.
 */
export interface IApplicationRouteApi {
  /** Корень приложения в URL платформы, напр. `/im/package-apps/<guid>/view`. */
  basePath: string;
  /** Внутренний путь приложения относительно `basePath`, с ведущим `/` (напр. `/orders/42`). */
  route: string;
  /**
   * Навигация внутри приложения. `subPath` — путь относительно `basePath`
   * (с ведущим `/` или без), может содержать query (`/orders?tab=2`).
   * `replace` — заменить запись в истории вместо push.
   */
  navigateApp: (subPath: string, options?: { replace?: boolean }) => void;
}

/** Пропсы, которые платформа передаёт в `mount`/`update` кастомного приложения. */
export interface IApplicationProps {
  /** Имя приложения (может отсутствовать до загрузки модели). */
  appName?: string;
  /** GUID приложения. */
  appGuid?: string;
  /** Код языка интерфейса платформы. */
  language: string;
  /** Включён ли debug-режим платформы. */
  isDebugMode: boolean;
  /** Проверка прав на запись для пакета приложения. */
  hasPackageWriteAccessChecker: () => boolean;
  /** API роутинга приложения — основной способ навигации. */
  appRouter: IApplicationRouteApi;
  /** Контекст привязанного пространства. undefined → приложение ни к чему не привязано. */
  workspaceContext?: IWorkspaceContext;
}

export interface IApplication {
  /** инициализация приложения */
  initialize?(container: HTMLElement): void;
  /** монтирование приложения */
  mount?(container: HTMLElement, props: IApplicationProps): void;
  /** обновление приложения */
  update?(container: HTMLElement, props: IApplicationProps): void;
  /** размонтирование приложения */
  unmount?(container: HTMLElement): void;
}

export interface IApplicationWithFilters extends IApplication {
  getFilterDescriptions?(): TFilterDescriptions;
}

export interface IApplicationClass {
  new (): IApplication;
}

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
export interface ITablesApi {
  list(params?: { textFilter?: string; paging?: IWorkspaceResourcePaging }): Promise<ITableInfo[]>;
}

/** Скрипт пространства (элемент списка). */
export interface IScriptInfo {
  id: number;
  name: string;
}
export interface IScriptsApi {
  list(params?: { paging?: IWorkspaceResourcePaging }): Promise<IScriptInfo[]>;
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
 * поверхность — в дизайн-спеке). Сейчас реализуются list-операции 4 ресурсов;
 * fileStorage, tables.getData, scripts.run/getStatus — следующие фазы (бэк-схема).
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

declare global {
  interface Infomaximum {
    defineApplication: (uuid: string, Application: IApplicationClass) => void;
  }
}
