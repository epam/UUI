import isEqual from 'react-fast-compare';
import { usePrevious } from '../../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../../types';
import { isQueryChanged } from './helpers';
import { useCallback, useEffect, useMemo } from 'react';
import { useDepsChanged } from '../../common/useDepsChanged';

export interface LazyFetchingAdvice {
    shouldLoad: boolean;
    shouldRefetch: boolean;
    shouldFetch: boolean;
    shouldReload: boolean;
    updatedAt: number;
}

export interface UseLazyFetchingAdvisorProps<TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
    filter?: TFilter;
    forceReload?: boolean;
    backgroundReload?: boolean;
    showSelectedOnly?: boolean;
    onFetch?: (lazyLoadingAdvice: LazyFetchingAdvice) => void;
}

export function useLazyFetchingAdvisor<TId, TFilter = any>(
    {
        dataSourceState,
        filter,
        forceReload,
        backgroundReload,
        showSelectedOnly,
        onFetch,
    }: UseLazyFetchingAdvisorProps<TId, TFilter>,
    deps: any[] = [],
) {
    const depsChanged = useDepsChanged(deps);
    const areMoreRowsNeeded = useCallback((
        prevValue?: DataSourceState<TFilter, TId>,
        newValue?: DataSourceState<TFilter, TId>,
    ) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex
            || prevValue?.visibleCount !== newValue?.visibleCount;

        return isFetchPositionAndAmountChanged;
    }, []);

    const prevFilter = usePrevious(filter);
    const prevDataSourceState = usePrevious(dataSourceState);
    const prevShowSelectedOnly = usePrevious(showSelectedOnly);

    const isFoldingChanged = !prevDataSourceState || dataSourceState.folded !== prevDataSourceState.folded;

    const shouldRefetch = useMemo(
        () => !prevDataSourceState
            || !isEqual(prevFilter, filter)
            || isQueryChanged(prevDataSourceState, dataSourceState)
            || (prevShowSelectedOnly !== showSelectedOnly && !showSelectedOnly)
            || forceReload
            || depsChanged,
        [dataSourceState, filter, forceReload, depsChanged],
    );

    const moreRowsNeeded = areMoreRowsNeeded(prevDataSourceState, dataSourceState);

    const shouldReload = shouldRefetch && !backgroundReload;
    const shouldLoad = isFoldingChanged || moreRowsNeeded || shouldReload;
    const shouldFetch = shouldRefetch || isFoldingChanged || moreRowsNeeded;

    const updatedAt = useMemo(() => Date.now(), [
        shouldLoad,
        shouldReload,
        shouldFetch,
        shouldRefetch,
        filter,
        showSelectedOnly,
        dataSourceState.folded,
        dataSourceState.topIndex,
        dataSourceState.visibleCount,
    ]);

    useEffect(() => {
        onFetch?.({ shouldFetch, shouldLoad, shouldReload, shouldRefetch, updatedAt });
    }, [shouldFetch, shouldLoad, shouldRefetch, shouldReload, updatedAt]);

    return useMemo(() => ({
        shouldLoad,
        shouldRefetch,
        shouldFetch,
        shouldReload,
        updatedAt,
    }), [
        shouldLoad,
        shouldRefetch,
        shouldFetch,
        shouldReload,
        updatedAt,
    ]);
}
