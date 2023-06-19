import { BaseListViewProps } from '@epam/uui-core';

export interface AsyncDataSourceProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    api(): Promise<TItem[]>;
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
