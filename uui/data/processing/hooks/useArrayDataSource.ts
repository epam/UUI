import { useMemo } from 'react';
import { ArrayDataSource, ArrayDataSourceProps } from '../ArrayDataSource';

export function useArrayDataSource<TItem, TId, TFilter>(params: ArrayDataSourceProps<TItem, TId, TFilter>) {
    const dataSource = useMemo(() => new ArrayDataSource({
        ...params,
    }), Object.keys(params).map(key => (params as any)[key]));

    return dataSource;
}