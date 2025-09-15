import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState, SortingOption } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { useUpdateTreeState } from './useUpdateTreeState';

export type UseSortTreeStateProps<TItem, TId, TFilter = any> = {
    sortBy?(item: TItem, sorting: SortingOption): any;
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSortTreeState<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
    }: UseSortTreeStateProps<TItem, TId, TFilter>,
    deps: any[],
): TreeState<TItem, TId> {
    const prevSorting = usePrevious(sorting);

    const sortTree = useUpdateTreeState({
        tree,
        shouldUpdate: () => !tree.isBlank() && sorting !== prevSorting,
        update: (currentTree) => currentTree.sort({ sorting, sortBy }),
    }, [sorting, ...deps]);

    if (tree === null || tree.isBlank()) {
        return tree;
    }

    return sortTree;
}
