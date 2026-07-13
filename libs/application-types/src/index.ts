/// <reference types="@infomaximum/global-types" />

import { type TFilterDescriptions } from "@infomaximum/custom-filter";
import { type IWorkspaceContext } from "./workspaceContext";

export * from "./workspaceContext";

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

/**
 * Функция запросов к GraphQL API системы от имени приложения.
 *
 * Единственный поддерживаемый транспорт к системе: платформа исполняет запрос
 * в своём realm'е и берёт на себя авторизацию, служебные заголовки, ротацию
 * сессии и разбор ошибок. Приложение передаёт запрос строкой; тип операции
 * (query/mutation) определяется автоматически, подписки не поддерживаются.
 *
 * Не делай собственный `fetch` к GraphQL-эндпоинту — он не пройдёт авторизацию
 * системы (в текущей версии платформы вернётся `csrf_invalid`).
 *
 * Ошибки бэкенда нормализованы (`{ code, params, message }`); ошибки канала
 * кодированы (`invalid_query`, `unsupported_operation`).
 *
 * Платформа запросы не отменяет: mutation'ы должны доезжать, а lifecycle
 * read-запросов — забота приложения (запросы работают как fire-and-forget).
 */
export type TApplicationGraphqlRequester = <
  TData = unknown,
  TVariables extends Record<string, unknown> = Record<string, unknown>,
>(
  query: string,
  variables?: TVariables
) => Promise<TData>;

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
  /**
   * Функция запросов к GraphQL API системы. Опциональна: старые версии
   * платформы поле не передают — перед использованием проверяйте наличие.
   */
  graphql?: TApplicationGraphqlRequester;
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

declare global {
  interface Infomaximum {
    defineApplication: (uuid: string, Application: IApplicationClass) => void;
  }
}
