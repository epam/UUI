import { useMemo, useRef } from 'react';
import { TreeState } from '../../newTree';
import { useSimplePrevious } from '../../../../../../hooks';

export interface UseUpdateTreeProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    shouldUpdate: () => boolean;
    update: (tree: TreeState<TItem, TId>) => TreeState<TItem, TId>;
}

export function useUpdateTree<TItem, TId>(
    {
        tree,
        shouldUpdate,
        update,
    }: UseUpdateTreeProps<TItem, TId>,
    deps: any[],
) {
    const treeRef = useRef<TreeState<TItem, TId>>(null);
    const prevDeps = useSimplePrevious(deps);
    const prevTree = useSimplePrevious(tree);

    const updatedTree = useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length
            || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);

        if (treeRef.current === null || prevTree !== tree || shouldUpdate || isDepsChanged) {
            treeRef.current = update(tree);
        }
        return treeRef.current;
    }, [tree, ...deps]);

    return updatedTree;
}
