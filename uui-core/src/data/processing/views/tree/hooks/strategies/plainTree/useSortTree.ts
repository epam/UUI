import { useMemo, useRef } from 'react';
import { usePrevious } from '../../../../../../../hooks';
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
    const prevTree = usePrevious(tree);
    const prevSorting = usePrevious(sorting);
    const prevDeps = usePrevious(deps);
    const sortedTreeRef = useRef(null);

    return useMemo(() => {
        if (sortedTreeRef.current === null || prevTree !== tree || sorting !== prevSorting || prevDeps !== deps) {
            sortedTreeRef.current = tree.sort({ sorting, sortBy });
        }
        return sortedTreeRef.current;
    }, [tree, sorting, ...deps]);
}
