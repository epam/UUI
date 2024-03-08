import { useCallback } from 'react';
import { SetDataSourceState } from '../../../../../types';

export interface UseFocusServiceProps<TId, TFilter = any> {
    setDataSourceState?: SetDataSourceState<TFilter, TId>;
}

export interface FocusService {
    handleOnFocus: (focusedIndex: number) => void;
}

export function useFocusService<TId, TFilter = any>({
    setDataSourceState,
}: UseFocusServiceProps<TId, TFilter>): FocusService {
    const handleOnFocus = useCallback((focusIndex: number) => {
        setDataSourceState((dataSourceState) => ({ ...dataSourceState, focusedIndex: focusIndex }));
    }, [setDataSourceState]);

    return { handleOnFocus };
}
