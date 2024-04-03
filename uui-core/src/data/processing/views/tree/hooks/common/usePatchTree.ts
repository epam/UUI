import { useMemo } from 'react';
import { newMap } from '../../helpers';
import { DataSourceState, PatchOptions } from '../../../../../../types';
import { PatchOrdering } from '../../constants';
import { usePrevious } from '../../../../../../hooks/usePrevious';
import { getSortedPatchByParentId } from '../../helpers/patch';
import { TreeState } from '../../treeState';

export interface UsePatchTreeProps<TItem, TId, TFilter = any> extends PatchOptions<TItem, TId> {
    tree: TreeState<TItem, TId>;
    sorting: DataSourceState<TFilter, TId>['sorting'];

}

export function usePatchTree<TItem, TId, TFilter = any>(
    {
        tree,
        patch,
        getNewItemPosition = () => PatchOrdering.TOP,
        getItemTemporaryOrder,
        fixItemBetweenSortings = true,
        isDeleted,
        sorting,
        sortBy,
    }: UsePatchTreeProps<TItem, TId, TFilter>,
) {
    const prevPatch = usePrevious(patch);
    const params = tree.visible.getParams();

    const patchAtLastSort = useMemo(() => {
        return prevPatch === null ? newMap<TId, TItem>({ complexIds: params.complexIds }) : patch;
    }, [sorting]);

    const sortedPatch = useMemo(
        () => getSortedPatchByParentId(
            tree.visible,
            patch,
            fixItemBetweenSortings ? patchAtLastSort : patch,
            getNewItemPosition,
            getItemTemporaryOrder,
            sortBy,
            sorting,
            isDeleted,
        ),
        [patch, sorting],
    );

    return useMemo(() => {
        return tree.patch({
            sortedPatch,
            patchAtLastSort: fixItemBetweenSortings ? patchAtLastSort : patch,
            getItemTemporaryOrder,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        });
    }, [tree, patch]);
}
