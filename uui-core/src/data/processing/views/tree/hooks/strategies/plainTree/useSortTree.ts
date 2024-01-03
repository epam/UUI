import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState, SortingOption } from '../../../../../../../types';
import { NewTree } from '../../../newTree';

export type UseSortTreeProps<TItem, TId, TFilter = any> = {
    sortBy?(item: TItem, sorting: SortingOption): any;
    tree: NewTree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
): NewTree<TItem, TId> {
    const prevTree = useSimplePrevious(tree);
    const prevSorting = useSimplePrevious(sorting);
    const prevDeps = useSimplePrevious(deps);
    const sortedTreeRef = useRef<NewTree<TItem, TId>>(null);

    return useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (sortedTreeRef.current === null || prevTree !== tree || sorting !== prevSorting || isDepsChanged) {
            sortedTreeRef.current = tree.sort({ sorting, sortBy });
        }
        return sortedTreeRef.current;
    }, [tree, sorting, ...deps]);
}
