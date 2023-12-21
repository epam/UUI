import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState, SortingOption } from '../../../../../../../types';
import { ITree } from '../../../../tree';

export type UseSortTreeProps<TItem, TId, TFilter = any> = {
    sortBy?(item: TItem, sorting: SortingOption): any;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = useSimplePrevious(tree);
    const prevSorting = useSimplePrevious(sorting);
    const prevDeps = useSimplePrevious(deps);
    const sortedTreeRef = useRef(null);

    return useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (sortedTreeRef.current === null || prevTree !== tree || sorting !== prevSorting || isDepsChanged) {
            sortedTreeRef.current = tree.sort({ sorting, sortBy });
        }
        return sortedTreeRef.current;
    }, [tree, sorting, ...deps]);
}
