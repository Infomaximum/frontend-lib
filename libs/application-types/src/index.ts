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
