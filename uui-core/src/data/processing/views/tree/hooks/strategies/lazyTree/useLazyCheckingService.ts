import isEqual from 'lodash.isequal';
import { CascadeSelectionTypes, DataSourceState } from '../../../../../../../types';
import { ITree, ROOT_ID } from '../../../ITree';
import { UseCheckingServiceProps, useCheckingService } from '../../services';
import { LoadResult } from './useLoadData';

interface UseLazyCheckingService<TItem, TId, TFilter = any> extends UseCheckingServiceProps<TItem, TId, TFilter> {
    loadMissing: (sourceTree: ITree<TItem, TId>, abortInProgress: boolean, options?: Partial<{
        loadAllChildren?(id: TId): boolean;
        isLoadStrict?: boolean;
    }>, dataSourceState?: DataSourceState<TFilter, TId>, withNestedChildren?: boolean) => Promise<LoadResult<TItem, TId>>
}

export function useLazyCheckingService<TItem, TId, TFilter = any>({ loadMissing, ...props }: UseLazyCheckingService<TItem, TId, TFilter>) {
    const checkingService = useCheckingService({ ...props });

    const { tree, dataSourceState, cascadeSelection } = props;
    const checkItems = async (isChecked: boolean, isRoot: boolean, checkedId?: TId) => {
        let checked = dataSourceState?.checked ?? [];

        const isImplicitMode = cascadeSelection === CascadeSelectionTypes.IMPLICIT;
        let resultTree = tree;
        if (cascadeSelection || isRoot) {
            const loadNestedLayersChildren = !isImplicitMode;
            const parents = tree.getParentIdsRecursive(checkedId);

            const result = await loadMissing(
                tree,
                false,
                {
                    // If cascadeSelection is implicit and the element is unchecked, it is necessary to load all children
                    // of all parents of the unchecked element to be checked explicitly. Only one layer of each parent should be loaded.
                    // Otherwise, should be loaded only checked element and all its nested children.
                    loadAllChildren: (id) => {
                        if (!cascadeSelection) {
                            return isChecked && isRoot;
                        }

                        if (isImplicitMode) {
                            return id === ROOT_ID || parents.some((parent) => isEqual(parent, id));
                        }

                        // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                        // So, they should be compared not by reference, but by value.
                        return isRoot || isEqual(id, checkedId) || (dataSourceState.search && parents.some((parent) => isEqual(parent, id)));
                    },
                    isLoadStrict: true,
                },
                { search: null },
                loadNestedLayersChildren,
            );

            resultTree = result.tree;
        }

        checked = resultTree.cascadeSelection(checked, checkedId, isChecked, {
            cascade: isImplicitMode ? cascadeSelection : (isRoot && isChecked) || cascadeSelection,
            isSelectable: (item: TItem) => checkingService.isItemCheckable(item),
        });

        // handleCheckedChange(checked);
    }

    const handleSelectAll = () => {

    }

    return {
        ...checkingService,
        handleSelectAll,
    }
}
