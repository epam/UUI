import { BaseListViewProps, ITree } from '@epam/uui-core';

export interface ArrayDatasourceProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    items?: TItem[] | ITree<TItem, TId>;
    getSearchFields?(item: TItem): string[];
    sortBy?(
        item: TItem,
        sorting: {
            field: string,
            direction?: 'asc' | 'desc',
        }
    ): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}
