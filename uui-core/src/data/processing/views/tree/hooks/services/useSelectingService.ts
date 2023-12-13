import { useCallback, useMemo } from 'react';
import { DataRowProps, DataSourceState } from '../../../../../../types';

export interface UseSelectingServiceProps<TId, TFilter = any> {
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;
}

export interface SelectingService<TItem, TId> {
    handleOnSelect: (rowProps: DataRowProps<TItem, TId>) => void;
}

export function useSelectingService<TItem, TId, TFilter = any>({
    setDataSourceState,
}: UseSelectingServiceProps<TId, TFilter>): SelectingService<TItem, TId> {
    const handleOnSelect = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        setDataSourceState((dsState) => ({
            ...dsState,
            selectedId: rowProps.id,
        }));
    }, [setDataSourceState]);

    return useMemo(
        () => ({ handleOnSelect }),
        [handleOnSelect],
    );
}
