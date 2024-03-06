import { useSimplePrevious } from '../../../../../../hooks';
import { DataSourceState, SortingOption } from '../../../../../../types';
import { TreeState } from '../../newTree';
import { useUpdateTree } from './useUpdateTree';

export type UseSortTreeProps<TItem, TId, TFilter = any> = {
    sortBy?(item: TItem, sorting: SortingOption): any;
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
};

export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
        isLoading,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
): TreeState<TItem, TId> {
    const prevSorting = useSimplePrevious(sorting);

    const sortTree = useUpdateTree({
        tree,
        shouldUpdate: () => sorting !== prevSorting,
        update: (currentTree) => currentTree.sort({ sorting, sortBy }),
    }, [sorting, ...deps]);

    if (isLoading || sortTree === null) {
        return tree;
    }

    return sortTree;
}
