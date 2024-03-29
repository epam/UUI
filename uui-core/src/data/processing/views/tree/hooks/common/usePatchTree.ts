import { useMemo } from 'react';
import { newMap } from '../../helpers';
import { DataSourceState, PatchItemsOptions } from '../../../../../../types';
import { PatchOrdering } from '../../constants';
import { useSimplePrevious } from '../../../../../../hooks';
import { getSortedPatchByParentId } from '../../helpers/patch';
import { TreeState } from '../../treeState';

export interface UsePatchTreeProps<TItem, TId, TFilter = any> extends PatchItemsOptions<TItem, TId> {
    tree: TreeState<TItem, TId>;
    sorting: DataSourceState<TFilter, TId>['sorting'];

}

export function usePatchTree<TItem, TId, TFilter = any>(
    {
        tree,
        patchItems,
        getNewItemPosition = () => PatchOrdering.TOP,
        getItemTemporaryOrder,
        fixItemBetweenSortings = true,
        isDeleted,
        sorting,
        sortBy,
    }: UsePatchTreeProps<TItem, TId, TFilter>,
) {
    const prevPatchItems = useSimplePrevious(patchItems);
    const params = tree.visible.getParams();

    const patchItemsAtLastSort = useMemo(() => {
        return prevPatchItems === null ? newMap<TId, TItem>({ complexIds: params.complexIds }) : patchItems;
    }, [sorting]);

    const sortedPatch = useMemo(
        () => getSortedPatchByParentId(
            tree.visible,
            patchItems,
            fixItemBetweenSortings ? patchItemsAtLastSort : patchItems,
            getNewItemPosition,
            getItemTemporaryOrder,
            sortBy,
            sorting,
            isDeleted,
        ),
        [patchItems, sorting],
    );

    return useMemo(() => {
        return tree.patchItems({
            sortedPatch,
            patchItemsAtLastSort: fixItemBetweenSortings ? patchItemsAtLastSort : patchItems,
            getItemTemporaryOrder,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        });
    }, [tree, patchItems]);
}
