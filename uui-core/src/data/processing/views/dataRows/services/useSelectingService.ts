import { useCallback, useMemo } from 'react';
import { DataRowProps, DataSourceState } from '../../../../../types';

export interface UseSelectingServiceProps<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>,
    setDataSourceState?: (dataSourceState: DataSourceState<TFilter, TId>) => void;
}

export interface SelectingService<TItem, TId> {
    handleOnSelect: (rowProps: DataRowProps<TItem, TId>) => void;
}

export function useSelectingService<TItem, TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
}: UseSelectingServiceProps<TId, TFilter>): SelectingService<TItem, TId> {
    const handleOnSelect = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        setDataSourceState?.({
            ...dataSourceState,
            selectedId: rowProps.id,
        });
    }, [dataSourceState, setDataSourceState]);

    return useMemo(
        () => ({ handleOnSelect }),
        [handleOnSelect],
    );
}
