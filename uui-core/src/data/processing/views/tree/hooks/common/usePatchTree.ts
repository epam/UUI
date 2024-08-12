import { useCallback, useMemo } from 'react';
import { newMap } from '../../helpers';
import { DataSourceState, IImmutableMap, IMap, PatchOptions } from '../../../../../../types';
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
            fixItemBetweenSortings,
        ),
        [patch, sorting, fixItemBetweenSortings],
    );
    const patchedTree = useMemo(() => {
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

    const applyPatch = useCallback((updated: IMap<TId, TItem> | IImmutableMap<TId, TItem>) => {
        const patchAfterSort = getSortedPatchByParentId(
            tree.visible,
            updated,
            fixItemBetweenSortings ? patchAtLastSort : updated,
            getNewItemPosition,
            getItemTemporaryOrder,
            sortBy,
            sorting,
            isDeleted,
            fixItemBetweenSortings,
        );

        return tree.patch({
            sortedPatch: patchAfterSort,
            patchAtLastSort: fixItemBetweenSortings ? patchAtLastSort : updated,
            getItemTemporaryOrder,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        }).visible;
    }, [tree, sorting, fixItemBetweenSortings]);

    return { tree: patchedTree, applyPatch };
}
