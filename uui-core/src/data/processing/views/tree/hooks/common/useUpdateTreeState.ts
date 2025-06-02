import { useMemo, useRef } from 'react';
import { TreeState } from '../../treeState';
import { usePrevious } from '../../../../../../hooks/usePrevious';
import { useDepsChanged } from './useDepsChanged';

export interface UseUpdateTreeStateProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    shouldUpdate: () => boolean;
    update: (tree: TreeState<TItem, TId>) => TreeState<TItem, TId>;
}

export function useUpdateTreeState<TItem, TId>(
    {
        tree,
        shouldUpdate,
        update,
    }: UseUpdateTreeStateProps<TItem, TId>,
    deps: any[],
) {
    const treeRef = useRef<TreeState<TItem, TId>>(null);
    const prevTree = usePrevious(tree);
    const depsChanged = useDepsChanged(deps);

    const updatedTree = useMemo(() => {
        if (treeRef.current === null || prevTree !== tree || shouldUpdate() || depsChanged) {
            treeRef.current = update(tree);
        }
        return treeRef.current;
    }, [tree, depsChanged, ...deps]);

    return updatedTree;
}
