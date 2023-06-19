import { LazyDataSource, LazyDataSourceProps } from '@epam/uui-core';

export type useLazyDataSource<TItem, TId, TFilter> = (
    props: LazyDataSourceProps<TItem, TId, TFilter>,
    deps: any[],
) => LazyDataSource<TItem, TId, TFilter>;
