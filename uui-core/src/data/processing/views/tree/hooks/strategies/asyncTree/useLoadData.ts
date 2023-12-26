import { useCallback, useEffect } from 'react';
import { DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import { ITree } from '../../..';

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: ITree<TItem, TId>;
}

export interface UseLoadDataProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    dataSourceState: DataSourceState<TFilter, TId>;
    onStart?: () => void,
    onComplete: (result: LoadResult<TItem, TId>) => void;
    onError?: (e: Error) => void;
}

export function useLoadData<TItem, TId, TFilter = any>(
    { tree, api, dataSourceState, onStart, onError, onComplete }: UseLoadDataProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const loadData = useCallback(async (
        sourceTree: ITree<TItem, TId>,
        dsState?: DataSourceState<TFilter, TId>,
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;
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
    }, [api]);

    useEffect(() => {
        onStart?.();
        loadData(tree, dataSourceState)
            .then((result) => {
                onComplete(result);
            })
            .catch((e) => {
                onComplete({ isUpdated: false, isOutdated: false, tree });
                console.error('useLoadData: Error while loading items.', e);
                onError?.(e);
            });
    }, deps);
}
