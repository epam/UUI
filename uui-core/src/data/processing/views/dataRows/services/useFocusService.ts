import { useCallback } from 'react';
import { SetDataSourceState } from '../../../../../types';

/**
 * Focus service configuration.
 */
export interface UseFocusServiceProps<TId, TFilter = any> {
    /**
     * DataSource state update handler.
     */
    setDataSourceState?: SetDataSourceState<TFilter, TId>;
}

/**
 * Focus service functionality.
 */
export interface FocusService {
    /**
     * Focus event handler.
     * @param focusedIndex - index of the row to be focused.
     */
    handleOnFocus: (focusedIndex: number) => void;
}

/**
 * Service, which provides focus functionality.
 * @returns focus service.
 */
export function useFocusService<TId, TFilter = any>({
    setDataSourceState,
}: UseFocusServiceProps<TId, TFilter>): FocusService {
    const handleOnFocus = useCallback((focusIndex: number) => {
        setDataSourceState((dataSourceState) => ({ ...dataSourceState, focusedIndex: focusIndex }));
    }, [setDataSourceState]);

    return { handleOnFocus };
}
