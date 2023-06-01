import { AsyncDataSource, AsyncDataSourceProps } from '@epam/uui-core';

export type useAsyncDataSource<TItem, TId, TFilter> = (
    props: AsyncDataSourceProps<TItem, TId, TFilter>,
    deps: any[],
) => AsyncDataSource<TItem, TId, TFilter>;
