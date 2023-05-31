import { BaseListViewProps, LazyDataSourceApi } from '@epam/uui-core';

export interface LazyDataSourceProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getChildCount?(item: TItem): number;
    filter?: TFilter;
    fetchStrategy?: 'sequential' | 'parallel';
    flattenSearchResults?: boolean;
    legacyLoadDataBehavior?: boolean;
}
