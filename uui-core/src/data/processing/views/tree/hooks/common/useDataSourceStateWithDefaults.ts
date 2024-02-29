import { useRef } from 'react';
import { DataSourceState } from '../../../../../../types';

interface UseDataSourceStateWithDefaults<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
}

const getDataSourceStateWithDefaults = <TId, TFilter = any>(dataSourceState: DataSourceState<TFilter, TId>) =>
    ((dataSourceState.topIndex === undefined || dataSourceState.visibleCount)
        ? {
            ...dataSourceState,
            topIndex: dataSourceState.topIndex ?? 0,
            visibleCount: dataSourceState.visibleCount ?? 20,
        }
        : dataSourceState);

export function useDataSourceStateWithDefaults<TId, TFilter = any>({ dataSourceState }: UseDataSourceStateWithDefaults<TId, TFilter>) {
    const dataSourceStateRef = useRef(getDataSourceStateWithDefaults(dataSourceState));

    dataSourceStateRef.current = getDataSourceStateWithDefaults(dataSourceState);

    return dataSourceStateRef.current;
}
