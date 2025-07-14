import { useMemo, useRef } from 'react';
import { usePrevious } from '../../../../../../hooks/usePrevious';
import { useDepsChanged } from './useDepsChanged';
import { ITree } from '../../ITree';

export interface UseUpdateTreeProps<TItem, TId> {
    tree: ITree<TItem, TId>;
    shouldUpdate: () => boolean;
    update: (tree: ITree<TItem, TId>) => ITree<TItem, TId>;
}

export function useUpdateTree<TItem, TId>(
    {
        tree,
        shouldUpdate,
        update,
    }: UseUpdateTreeProps<TItem, TId>,
    deps: any[],
) {
    const treeRef = useRef<ITree<TItem, TId>>(null);
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
