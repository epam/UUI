import isEqual from 'lodash.isequal';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { isQueryChanged } from './helpers';
import { useCallback, useMemo } from 'react';

export interface UseLazyFetchingAdvisorProps<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
    filter?: TFilter;
    forceReload?: boolean;
    backgroundReload?: boolean;
    // rowsCount?: number;
}

export function useLazyFetchingAdvisor<TId, TFilter = any>({
    dataSourceState,
    filter,
    forceReload,
    backgroundReload,
    // rowsCount,
}: UseLazyFetchingAdvisorProps<TId, TFilter>) {
    const areMoreRowsNeeded = useCallback((
        prevValue?: DataSourceState<TFilter, TId>,
        newValue?: DataSourceState<TFilter, TId>,
    ) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex
            || prevValue?.visibleCount !== newValue?.visibleCount;

        return isFetchPositionAndAmountChanged;
    }, []);

    const prevFilter = useSimplePrevious(filter);
    const prevDataSourceState = useSimplePrevious(dataSourceState);

    const isFoldingChanged = !prevDataSourceState || dataSourceState.folded !== prevDataSourceState.folded;

    const shouldRefetch = useMemo(
        () => !prevDataSourceState
            || !isEqual(prevFilter, filter)
            || isQueryChanged(prevDataSourceState, dataSourceState)
            || forceReload,
        [dataSourceState, filter, forceReload],
    );

    const moreRowsNeeded = areMoreRowsNeeded(prevDataSourceState, dataSourceState);

    const shouldReload = shouldRefetch && (!backgroundReload || forceReload);
    const shouldLoad = isFoldingChanged || moreRowsNeeded || shouldReload;
    const shouldFetch = shouldRefetch || isFoldingChanged || moreRowsNeeded;

    return useMemo(() => ({
        shouldLoad,
        shouldRefetch,
        shouldFetch,
        shouldReload,
    }), [shouldLoad, shouldRefetch, shouldFetch]);
}
