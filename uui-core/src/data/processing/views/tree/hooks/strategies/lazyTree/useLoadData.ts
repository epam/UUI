import { useCallback, useRef } from 'react';
import { CascadeSelection, CascadeSelectionTypes, DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import { ROOT_ID } from '../../../../tree';
import isEqual from 'lodash.isequal';
import { CommonDataSourceConfig } from '../types';
import { NewTree } from '../../../newTree';
import { SnapshotId } from '../../../newTree/NewTree';

export interface UseLoadDataProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    'dataSourceState' | 'getChildCount' | 'flattenSearchResults'
    > {

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    filter?: TFilter;
    isFolded: (item: TItem) => boolean;
    fetchStrategy?: 'sequential' | 'parallel';
    cascadeSelection?: CascadeSelection;
}

export interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: NewTree<TItem, TId>;
}

export function useLoadData<TItem, TId, TFilter = any>(
    props: UseLoadDataProps<TItem, TId, TFilter>,
) {
    const { api, filter, isFolded, cascadeSelection } = props;

    const promiseInProgressRef = useRef<Promise<LoadResult<TItem, TId>>>();

    const loadMissingImpl = useCallback(async (
        sourceTree: NewTree<TItem, TId>,
        options?: Partial<{
            loadAllChildren?(id: TId): boolean;
            isLoadStrict?: boolean;
        }>,
        dataSourceState?: DataSourceState<TFilter, TId>,
        withNestedChildren?: boolean,
        usingSnapshot: SnapshotId = 'visible',
    ): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;

        try {
            const newTreePromise = sourceTree.load({
                using: usingSnapshot,
                options: {
                    ...props,
                    ...options,
                    isFolded,
                    api,
                    filter: {
                        ...filter,
                        ...props.dataSourceState?.filter,
                        ...dataSourceState?.filter,
                    },
                },
                dataSourceState: { ...props.dataSourceState, ...dataSourceState },
                withNestedChildren,
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
            console.error('LazyListView: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    }, [isFolded, api, filter, props.dataSourceState]);

    const loadMissing = useCallback((
        sourceTree: NewTree<TItem, TId>,
        abortInProgress: boolean,
        options?: Partial<{
            loadAllChildren?(id: TId): boolean;
            isLoadStrict?: boolean;
        }>,
        dataSourceState?: DataSourceState<TFilter, TId>,
        withNestedChildren?: boolean,
        usingSnapshot: SnapshotId = 'visible',
    ): Promise<LoadResult<TItem, TId>> => {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed
        if (promiseInProgressRef.current === null || abortInProgress) {
            promiseInProgressRef.current = Promise.resolve({ isUpdated: false, isOutdated: false, tree: sourceTree });
        }

        promiseInProgressRef.current = promiseInProgressRef.current.then(() =>
            loadMissingImpl(sourceTree, options, dataSourceState, withNestedChildren, usingSnapshot));

        return promiseInProgressRef.current;
    }, [loadMissingImpl]);

    const loadMissingOnCheck = useCallback(async (currentTree: NewTree<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => {
        const isImplicitMode = cascadeSelection === CascadeSelectionTypes.IMPLICIT;

        if (!cascadeSelection && !isRoot) {
            return currentTree;
        }

        const loadNestedLayersChildren = !isImplicitMode;
        const coreTreeSnapshot = currentTree.snapshot('core');
        const parents = coreTreeSnapshot.getParentIdsRecursive(id);
        const { tree: treeWithMissingRecords } = await loadMissing(
            currentTree,
            false,
            {
                // If cascadeSelection is implicit and the element is unchecked, it is necessary to load all children
                // of all parents of the unchecked element to be checked explicitly. Only one layer of each parent should be loaded.
                // Otherwise, should be loaded only checked element and all its nested children.
                loadAllChildren: (itemId) => {
                    if (!cascadeSelection) {
                        return isChecked && isRoot;
                    }

                    if (isImplicitMode) {
                        return itemId === ROOT_ID || parents.some((parent) => isEqual(parent, itemId));
                    }

                    // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                    // So, they should be compared not by reference, but by value.
                    return isRoot || isEqual(itemId, id) || (props.dataSourceState.search && parents.some((parent) => isEqual(parent, itemId)));
                },
                isLoadStrict: true,
            },
            { search: null },
            loadNestedLayersChildren,
            'core',
        );

        return treeWithMissingRecords;
    }, [cascadeSelection, loadMissing, props.dataSourceState.search]);

    return { loadMissing, loadMissingOnCheck };
}
