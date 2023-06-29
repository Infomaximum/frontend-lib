import type {
  EFilteringMethods,
  TFilterPersistValue,
  TFilterState,
  TFilterTypename,
  TFilterValue,
} from "@infomaximum/base-filter";

export * from "@infomaximum/base-filter";

/** Свойства компонента фильтра */
export interface ICustomFilterComponentProps<
  V extends TFilterValue = TFilterValue
> {
  /** колбек добавления фильтра */
  addFilter(value: V): void;
  /** колбек редактирования фильтра */
  editFilter(value: V): void;
  /** открыт компонент */
  open: boolean;
  /** добавление/редактирование фильтра */
  mode: EFilteringMethods;
  /** закрытие компонента */
  onCancel(): void;
  filterValue: V;
}

export interface ICustomFilter<V extends TFilterValue = TFilterValue> {
  renderAddComponent(
    container: HTMLElement | undefined,
    props: ICustomFilterComponentProps<V>
  ): void;
  renderEditComponent(
    container: HTMLElement | undefined,
    props: ICustomFilterComponentProps<V>
  ): void;
  getFilterForPersist(state: TFilterState): TFilterPersistValue;
  getFilterSpoilerContent(filterValues: TFilterValue, language: string): string;
  getQueryParamName(filterValues: TFilterValue): string;
  getTypename(): string;
  isShowInAddFilterList(): boolean;
  isSingle: boolean;
  prepareValueForServer(filterValues: TFilterValue): any;
  getCaption(language: string, filterValues: TFilterValue | undefined): string;
}

export interface IFilterEntity {
  new (...args: any[]): ICustomFilter;

  getFilterName?(
    typename: TFilterTypename,
    isSingle: boolean,
    lastFilterId: number,
    filterValue: TFilterValue
  ): string;

  restoreFilterByStruct(struct: TFilterPersistValue): TFilterState;
}

export type TFilterDescriptions = IFilterEntity[];
