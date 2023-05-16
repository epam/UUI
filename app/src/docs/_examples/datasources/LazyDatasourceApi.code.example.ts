export interface SortingOption<T = any> {
    field: keyof T;
    direction?: 'asc' | 'desc';
}

export interface LazyDataSourceApiRequestRange {
    from: number;
    count?: number;
}

export interface LazyDataSourceApiRequestContext<TItem, TId> {
    parentId?: TId | null;
    parent?: TItem | null;
}

export interface LazyDataSourceApiRequest<TItem, TId = any, TFilter = {}> {
    filter?: TFilter;
    sorting?: SortingOption[];
    search?: string;
    range?: LazyDataSourceApiRequestRange;
    page?: number;
    pageSize?: number;
    ids?: TId[];

}

export interface LazyDataSourceApiResponse<TItem> {
    items: TItem[];
    from?: number;
    count?: number;
}

export type LazyDataSourceApi<TItem, TId, TFilter> = (
    request: LazyDataSourceApiRequest<TItem, TId, TFilter>,
    context?: LazyDataSourceApiRequestContext<TItem, TId>
) => Promise<LazyDataSourceApiResponse<TItem>>;
