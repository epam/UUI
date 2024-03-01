import { useCallback, useEffect, useMemo, useState } from 'react';
import { DataSourceState, IMap, LazyDataSourceApi } from '../../../../../../../types';
import { TreeState, getSelectedAndChecked } from '../../../newTree';
import { useSimplePrevious } from '../../../../../../../hooks';
import { isQueryChanged } from '../lazyTree/helpers';
import { RecordStatus } from '../../../types';
import { useItemsStatusCollector } from '../../common';

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: TreeState<TItem, TId>;
    error?: Error;
}

export interface UseLoadDataProps<TItem, TId, TFilter = any> {
    tree: TreeState<TItem, TId>;
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    dataSourceState?: DataSourceState<TFilter, TId>;
    forceReload?: boolean;
    showOnlySelected?: boolean;
    itemsStatusMap?: IMap<TId, RecordStatus>;
    complexIds?: boolean;
    getId: (item: TItem) => TId;
    isLoaded?: boolean;
}

export function useLoadData<TItem, TId, TFilter = any>(
    {
        tree, api, dataSourceState, forceReload, showOnlySelected, itemsStatusMap, isLoaded: isPrevouslyLoaded,
        complexIds, getId,
    }: UseLoadDataProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevDataSourceState = useSimplePrevious(dataSourceState);
    const prevDeps = useSimplePrevious(deps);
    const prevForceReload = useSimplePrevious(forceReload);

    const [loadedTree, setLoadedTree] = useState(tree);
    const [isLoaded, setIsLoaded] = useState(isPrevouslyLoaded);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const itemsStatusCollector = useItemsStatusCollector({ itemsStatusMap, complexIds, getId }, []);
    const watchedApi = useMemo(
        () => itemsStatusCollector.watch(api),
        [itemsStatusCollector, api],
    );

    const loadData = useCallback(async (
        sourceTree: TreeState<TItem, TId>,
        dsState: DataSourceState<TFilter, TId> = {},
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;
        const { checked, ...partialDsState } = dsState;
        try {
            const newTreePromise = sourceTree.loadAll<TFilter>({
                using: partialDsState.search ? 'visible' : undefined,
                options: {
                    api: watchedApi,
                    filter: {
                        ...dsState?.filter,
                    },
                },
                dataSourceState: partialDsState,
            });

            const newTree = await newTreePromise;
            const linkToTree = sourceTree;

            // If tree is changed during this load, than there was reset occurred (new value arrived)
            // We need to tell caller to reject this result
            const isOutdated = linkToTree !== loadingTree;
            const isUpdated = linkToTree !== newTree;
            return { isUpdated, isOutdated, tree: newTree };
        } catch (e) {
            // TBD - correct error handling
            console.error('useLoadData: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree, error: e };
        }
    }, [api]);

    const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
    const shouldForceReload = prevForceReload !== forceReload && forceReload;

    const selectedAndChecked = getSelectedAndChecked(dataSourceState);
    const shouldLoad = !isLoading && !isFetching && !isLoaded && ((showOnlySelected && selectedAndChecked.length) || !showOnlySelected);

    useEffect(() => {
        if (isDepsChanged || shouldForceReload) {
            setLoadedTree(tree);
            setIsLoaded(false);
        }
    }, [isDepsChanged, shouldForceReload, tree]);

    useEffect(() => {
        if (shouldLoad) {
            setIsFetching(true);
            if (!isQueryChanged(prevDataSourceState, dataSourceState)) {
                setIsLoading(true);
            }

            itemsStatusCollector.setPending(getSelectedAndChecked(dataSourceState));
            loadData(tree, dataSourceState)
                .then(({ isOutdated, isUpdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
                        setLoadedTree(newTree);
                    }
                })
                .finally(() => {
                    setIsLoaded(true);
                    setIsFetching(false);
                    setIsLoading(false);
                });
        }
    }, [shouldLoad, isDepsChanged, shouldForceReload]);

    return { tree: loadedTree, isLoading, isFetching, isLoaded, itemsStatusCollector };
}
