import { useCallback, useMemo } from 'react';
import { DataSourceState } from '../../../../../types';

export interface UseFocusServiceProps<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>,
    setDataSourceState?: (dataSourceState: DataSourceState<TFilter, TId>) => void;
}

export interface FocusService {
    handleOnFocus: (focusedIndex: number) => void;
}

export function useFocusService<TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
}: UseFocusServiceProps<TId, TFilter>): FocusService {
    const handleOnFocus = useCallback((focusIndex: number) => {
        setDataSourceState({
            ...dataSourceState,
            focusedIndex: focusIndex,
        });
    }, [dataSourceState, setDataSourceState]);

    return useMemo(
        () => ({ handleOnFocus }),
        [handleOnFocus],
    );
}
