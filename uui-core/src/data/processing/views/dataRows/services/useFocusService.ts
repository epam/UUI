import { useCallback } from 'react';
import { DataSourceState } from '../../../../../types';

export interface UseFocusServiceProps<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;
}

export interface FocusService {
    handleOnFocus: (focusedIndex: number) => void;
}

export function useFocusService<TId, TFilter = any>({
    dataSourceState,
    setDataSourceState,
}: UseFocusServiceProps<TId, TFilter>): FocusService {
    const handleOnFocus = useCallback((focusIndex: number) => {
        setDataSourceState({ ...dataSourceState, focusedIndex: focusIndex });
    }, [setDataSourceState, dataSourceState]);

    return { handleOnFocus };
}
