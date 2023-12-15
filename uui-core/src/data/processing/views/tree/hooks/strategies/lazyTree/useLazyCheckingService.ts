import { useMemo } from 'react';
import { CascadeSelection, CascadeSelectionTypes, DataRowOptions, DataSourceState } from '../../../../../../../types';
import { ITree, ROOT_ID } from '../../../';
import { CheckingService, useCheckingService } from '../../services';
import { LoadResult } from './useLoadData';
import isEqual from 'lodash.isequal';

export interface UseLazyCheckingServiceProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    onTreeUpdate: (tree: ITree<TItem, TId>) => void;
    getParentId?: (item: TItem) => TId;
    cascadeSelection?: CascadeSelection;
    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    dataSourceState: DataSourceState<TFilter, TId>,
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    loadMissingRecords?: (
        sourceTree: ITree<TItem, TId>,
        abortInProgress: boolean,
        options?: Partial<{
            loadAllChildren?(id: TId): boolean;
            isLoadStrict?: boolean;
        }>,
        dataSourceState?: DataSourceState<TFilter, TId>,
        withNestedChildren?: boolean,
    ) => Promise<LoadResult<TItem, TId>>;
}

export function useLazyCheckingService<TItem, TId>(props: UseLazyCheckingServiceProps<TItem, TId>): CheckingService<TItem, TId> {
    const { cascadeSelection, dataSourceState } = props;
    const loadMissingRecords = async (currentTree: ITree<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => {
        const isImplicitMode = cascadeSelection === CascadeSelectionTypes.IMPLICIT;

        if (!cascadeSelection && !isRoot) {
            return currentTree;
        }

        const loadNestedLayersChildren = !isImplicitMode;
        const parents = currentTree.getParentIdsRecursive(id);
        const { tree: treeWithMissingRecords } = await props.loadMissingRecords(
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
                    return isRoot || isEqual(itemId, id) || (dataSourceState.search && parents.some((parent) => isEqual(parent, itemId)));
                },
                isLoadStrict: true,
            },
            { search: null },
            loadNestedLayersChildren,
        );

        if (currentTree !== treeWithMissingRecords) {
            props.onTreeUpdate(treeWithMissingRecords);
        }

        return treeWithMissingRecords;
    };

    const checkingService = useCheckingService({
        ...props,
        loadMissingRecords,
    });

    return useMemo(
        () => ({ ...checkingService }),
        [checkingService],
    );
}
