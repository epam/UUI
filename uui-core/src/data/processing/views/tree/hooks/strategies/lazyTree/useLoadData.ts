import { useRef } from 'react';
import { DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import { ITree } from '../../../../tree';

export interface UseLoadDataProps<TItem, TId, TFilter = any> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    dataSourceState: DataSourceState<TFilter, TId>;
    isFolded: (item: TItem) => boolean;
    fetchStrategy?: 'sequential' | 'parallel';
    flattenSearchResults?: boolean;
    getChildCount?(item: TItem): number;
}

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: ITree<TItem, TId>;
}

export function useLoadData<TItem, TId, TFilter = any>(
    props: UseLoadDataProps<TItem, TId, TFilter>,
) {
    const { api, filter, isFolded } = props;

    const promiseInProgressRef = useRef<Promise<LoadResult<TItem, TId>>>();

    const loadMissing = (
        sourceTree: ITree<TItem, TId>,
        abortInProgress: boolean,
        options?: Partial<{
            loadAllChildren?(id: TId): boolean;
            isLoadStrict?: boolean;
        }>,
        dataSourceState?: DataSourceState<TFilter, TId>,
        withNestedChildren?: boolean,
    ): Promise<LoadResult<TItem, TId>> => {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed
        if (promiseInProgressRef.current === null || abortInProgress) {
            promiseInProgressRef.current = Promise.resolve({ isUpdated: false, isOutdated: false, tree: sourceTree });
        }

        promiseInProgressRef.current = promiseInProgressRef.current.then(() =>
            loadMissingImpl(sourceTree, options, dataSourceState, withNestedChildren));

        return promiseInProgressRef.current;
    };

    const loadMissingImpl = async (
        sourceTree: ITree<TItem, TId>,
        options?: Partial<{
            loadAllChildren?(id: TId): boolean;
            isLoadStrict?: boolean;
        }>,
        dataSourceState?: DataSourceState<TFilter, TId>,
        withNestedChildren?: boolean,
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;

        try {
            const newTreePromise = sourceTree.load(
                {
                    ...props,
                    ...options,
                    isFolded,
                    api,
                    filter: { ...filter },
                },
                { ...props.dataSourceState, ...dataSourceState },
                withNestedChildren,
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
            console.error('LazyListView: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    };

    return { loadMissing };
}
