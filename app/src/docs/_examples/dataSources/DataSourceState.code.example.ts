export interface SortingOption<T = any> {
    field: keyof T;
    direction?: 'asc' | 'desc';
}

export interface DataSourceState<TFilter = Record<string, any>, TId = any> {
    search?: string;
    checked?: TId[];
    folded?: Record<string, boolean>;
    filter?: TFilter;
    sorting?: SortingOption[];

    selectedId?: TId;
    indexToScroll?: number;
    focusedIndex?: number;
    topIndex?: number;
    visibleCount?: number;

    page?: number;
    pageSize?: number;
}
