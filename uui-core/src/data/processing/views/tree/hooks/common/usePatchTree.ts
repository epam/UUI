import { useMemo } from 'react';
import { TreeState, newMap } from '../../newTree';
import { DataSourceState, PatchItemsOptions } from '../../../../../../types';
import { PatchOrdering } from '../../PatchOrderingMap';
import { useSimplePrevious } from '../../../../../../hooks';
import { getSortedPatchByParentId } from '../../helpers/patch';

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
            patchItemsAtLastSort,
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
            patchItemsAtLastSort,
            getItemTemporaryOrder,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        });
    }, [tree, patchItems]);
}
