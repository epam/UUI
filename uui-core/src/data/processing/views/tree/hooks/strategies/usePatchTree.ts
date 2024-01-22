import { useMemo } from 'react';
import { ItemsMap } from '../../../../../../data';
import { TreeState } from '../../newTree';

export interface UsePatchTreeProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    patchItems: ItemsMap<TId, TItem>;
}

export function usePatchTree<TItem, TId>(
    { tree, patchItems }: UsePatchTreeProps<TItem, TId>,
) {
    return useMemo(() => {
        return tree.patchItems({ patchItems });
    }, [tree, patchItems]);
}
