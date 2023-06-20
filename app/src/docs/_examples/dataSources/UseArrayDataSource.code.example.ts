import { ArrayDataSource, ArrayDataSourceProps } from '@epam/uui-core';

export type useArrayDataSource<TItem, TId, TFilter> = (
    props: ArrayDataSourceProps<TItem, TId, TFilter>,
    deps: any[],
) => ArrayDataSource<TItem, TId, TFilter>;
