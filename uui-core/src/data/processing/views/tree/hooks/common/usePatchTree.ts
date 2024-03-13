import { useMemo } from 'react';
import { TreeState } from '../../newTree';
import { PatchItemsOptions } from '../../../../../../types';

export interface UsePatchTreeProps<TItem, TId> extends PatchItemsOptions<TItem, TId> {
    tree: TreeState<TItem, TId>;
}

export function usePatchTree<TItem, TId>(
    { tree, patchItems, isDeleted, getPosition }: UsePatchTreeProps<TItem, TId>,
) {
    return useMemo(() => {
        return tree.patchItems({ patchItems, isDeleted, getPosition });
    }, [tree, patchItems]);
}
