import { useEffect, useState } from 'react';
import { DataSourceState, IImmutableMap, IMap, LazyDataSourceApi } from '../../../../../../../types';
import { TreeState } from '../../../treeState';
import { usePrevious } from '../../../../../../../hooks/usePrevious';
import { isQueryChanged } from '../lazyTree/helpers';
import { useLoadCancellation, isAbortError, useItemsStatusCollector } from '../../common';
import { getSelectedAndChecked } from '../../../treeStructure';
import { NOT_FOUND_RECORD } from '../../../constants';
import { ItemsStatuses } from '../types';

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: TreeState<TItem, TId>;
}

export interface UseLoadDataProps<TItem, TId, TFilter = any> extends ItemsStatuses<TItem, TId, TFilter> {
    tree: TreeState<TItem, TId>;
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    dataSourceState?: DataSourceState<TFilter, TId>;
    forceReload?: boolean;
    showSelectedOnly?: boolean;
    complexIds?: boolean;
    getId: (item: TItem) => TId;
    isLoaded?: boolean;
    onForceReloadComplete?: () => void;
    patch?: IMap<TId, TItem> | IImmutableMap<TId, TItem>;
}

export function useLoadData<TItem, TId, TFilter = any>(
    {
        tree, api, dataSourceState, showSelectedOnly, isLoaded: isPrevouslyLoaded,
        complexIds, getId, onForceReloadComplete, forceReload, patch,
        itemsStatusCollector: externalItemsStatusCollector, itemsStatusMap,
    }: UseLoadDataProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevDataSourceState = usePrevious(dataSourceState);
    const prevForceReload = usePrevious(forceReload);

    const [loadedTree, setLoadedTree] = useState(tree);
    const [isLoaded, setIsLoaded] = useState(isPrevouslyLoaded);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const itemsStatusCollector = useItemsStatusCollector(
        {
            itemsStatusMap,
            complexIds,
            getId,
            itemsStatusCollector: externalItemsStatusCollector,
            dataSourceState,
            patch,
        },
        [itemsStatusMap, externalItemsStatusCollector],
    );

    const { getSignal } = useLoadCancellation();

    const loadData = async (
        sourceTree: TreeState<TItem, TId>,
        dsState: DataSourceState<TFilter, TId> = {},
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;
        const { checked, ...partialDsState } = dsState;
        const signal = getSignal();

        try {
            const newTree = await sourceTree.loadAll<TFilter>({
                using: partialDsState.search ? 'visible' : undefined,
                options: {
                    api: itemsStatusCollector.watch(api),
                    filter: {
                        ...dsState?.filter,
                    },
                    signal,
                },
                dataSourceState: partialDsState,
            });

            if (signal.aborted) {
                return { isUpdated: false, isOutdated: true, tree: loadingTree };
            }

            return {
                isUpdated: loadingTree !== newTree,
                isOutdated: false,
                tree: newTree,
            };
        } catch (e) {
            if (signal.aborted || isAbortError(e)) {
                return { isUpdated: false, isOutdated: true, tree: loadingTree };
            }

            // TBD - correct error handling
            console.error('useLoadData: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    };

    const shouldForceReload = prevForceReload !== forceReload && forceReload;

    const shouldLoad = (
        !isFetching
        && !isLoaded
        && (!showSelectedOnly || (showSelectedOnly && getSelectedAndChecked(dataSourceState, patch).length))
    )
    || forceReload;

    useEffect(() => {
        if (shouldForceReload) {
            setLoadedTree(tree);
        }
    }, [shouldForceReload]);

    useEffect(() => {
        if (isLoaded) {
            setIsLoaded(false);
        }
    }, [...deps]);

    useEffect(() => {
        if (shouldLoad) {
            setIsFetching(true);
            if (!isQueryChanged(prevDataSourceState, dataSourceState)) {
                setIsLoading(true);
            }
            const checked = getSelectedAndChecked(dataSourceState, patch);

            loadData(tree, dataSourceState)
                .then(({ isOutdated, isUpdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
                        setLoadedTree(newTree);

                        const notLoaded = checked.filter((id) => newTree.getById(id) === NOT_FOUND_RECORD);
                        itemsStatusCollector.setNotFound(notLoaded);
                        if (forceReload) {
                            onForceReloadComplete();
                        }
                    }
                })
                .catch((e) => {
                    itemsStatusCollector.setFailed(checked);
                    throw e;
                })
                .finally(() => {
                    setIsLoaded(true);
                    setIsFetching(false);
                    setIsLoading(false);
                });
        }
    }, [...deps, shouldLoad, shouldForceReload]);

    return { tree: loadedTree, isLoading, isFetching, isLoaded, itemsStatusCollector };
}
