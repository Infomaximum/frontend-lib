/// <reference types="@infomaximum/global-types" />

import { type TFilterDescriptions } from "@infomaximum/custom-filter";

export interface IApplication {
  /** инициализация приложения */
  initialize?(container: HTMLElement): void;
  /** монтирование приложения */
  mount?(container: HTMLElement, props: Record<string, any>): void;
  /** обновление приложения */
  update?(container: HTMLElement, props: Record<string, any>): void;
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
