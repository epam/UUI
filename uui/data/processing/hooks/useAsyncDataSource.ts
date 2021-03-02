import { useMemo } from 'react';
import { AsyncDataSource, AsyncDataSourceProps } from '../AsyncDataSource';
import { useReducer } from 'react';

export function useAsyncDataSource<TItem, TId, TFilter >(params: AsyncDataSourceProps<TItem, TId, TFilter>) {
    const dataSource = useMemo(() => new AsyncDataSource({
        ...params,
    }), []);

    return dataSource;
}