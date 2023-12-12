import { useCallback, useMemo } from 'react';
import { DataSourceState } from '../../../../../types';

export interface UseFocusServiceProps<TId, TFilter = any> {
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;
}

export interface FocusService {
    handleOnFocus: (focusedIndex: number) => void;
}

export function useFocusService<TId, TFilter = any>({
    setDataSourceState,
}: UseFocusServiceProps<TId, TFilter>): FocusService {
    const handleOnFocus = useCallback((focusIndex: number) => {
        setDataSourceState((dsState) => ({
            ...dsState,
            focusedIndex: focusIndex,
        }));
    }, [setDataSourceState]);

    return useMemo(
        () => ({ handleOnFocus }),
        [handleOnFocus],
    );
}
