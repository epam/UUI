import { useMemo } from 'react';
import { LazyDataSource, LazyDataSourceProps } from '../LazyDataSource';

export function useLazyDataSource<TItem, TId, TFilter >(params: LazyDataSourceProps<TItem, TId, TFilter>, dependencies?: any[]) {
    dependencies = dependencies || Object.keys(params).map(key => (params as any)[key]);

    const dataSource = useMemo(() => new LazyDataSource({
        ...params,
    }), dependencies);

    return dataSource;
}