import { useCallback, useEffect, useState } from 'react';
import { DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import { ITree } from '../../..';

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: ITree<TItem, TId>;
    error?: Error;
}

export interface UseLoadDataProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    dataSourceState?: DataSourceState<TFilter, TId>;
}

export function useLoadData<TItem, TId, TFilter = any>(
    { tree, api, dataSourceState }: UseLoadDataProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const [loadedTree, setLoadedTree] = useState(tree);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async (
        sourceTree: ITree<TItem, TId>,
        dsState: DataSourceState<TFilter, TId> = {},
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;

        try {
            const newTreePromise = sourceTree.loadAll(
                {
                    api,
                    filter: {
                        ...dsState?.filter,
                    },
                },
                dsState,
            );

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

    useEffect(() => {
        setIsLoading(true);
        loadData(tree, dataSourceState)
            .then(({ isOutdated, isUpdated, tree: newTree }) => {
                if (isUpdated && !isOutdated) {
                    setLoadedTree(newTree);
                }
            })
            .finally(() => setIsLoading(false));
    }, deps);

    return { tree: loadedTree, isLoading };
}
