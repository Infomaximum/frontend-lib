import type { Localization } from "@infomaximum/localization";

export enum EFilteringMethods {
  adding = "adding",
  editing = "editing",
}

/** Тип значения фильтра */
export type TFilterValue = any;

export type TFilterTypename = string;

/** Тип значения фильтра подготовленного, для отправки на сервер */
export type TPreparedFilterValue = any;

/** Тип структуры фильтра для сохранения в localStorage или url */
export type TFilterPersistValue = {
  type: TFilterTypename;
};

export type TFilterState = {
  typename: TFilterTypename;
  value: TFilterValue;
};

export type TBaseFilterComponentProps = {
  mode: EFilteringMethods;
};

export interface IBaseFilter<
  IAddFilterComponentProps extends TBaseFilterComponentProps = TBaseFilterComponentProps,
  IEditFilterComponentProps extends TBaseFilterComponentProps = TBaseFilterComponentProps,
  FilterValue = any
> {
  getTypename(): string;
  getCaption(localization: Localization, filterValue?: FilterValue): string;

  /**
   * true, если фильтр имеет одиночный тип (т.е. заменяет аналогичный фильтр,
   * при добавлении) и false, если фильтр имеет множественный тип (т.е. при добавлении фильтра,
   * добавляется новый элемент в панели)
   */
  isSingle: boolean;

  getAddFilterComponent():
    | React.ComponentType<IAddFilterComponentProps>
    | undefined;
  getEditFilterComponent(
    filterValue: FilterValue
  ): React.ComponentType<IEditFilterComponentProps> | undefined;
  prepareValueForServer(filterValue: TFilterValue): TPreparedFilterValue;
  getQueryParamName(filterValue: FilterValue): string;

  getFilterForPersist(state: TFilterState): TFilterPersistValue;

  getFilterSpoilerContent(
    filterValue: FilterValue,
    localization: Localization
  ): React.ReactNode;

  isShowInAddFilterList(): boolean;
}
