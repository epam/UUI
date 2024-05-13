import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState, SortConfig } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { useUpdateTree } from './useUpdateTree';

export interface UseSortTreeProps<TItem, TId, TFilter = any> extends SortConfig<TItem> {
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
}

export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
        sortingSettings,
        isLoading,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
): TreeState<TItem, TId> {
    const prevSorting = usePrevious(sorting);

    const { getId } = tree.visible.getParams();
    const sortTree = useUpdateTree({
        tree,
        shouldUpdate: () => sorting !== prevSorting,
        update: (currentTree) => currentTree
            .sort({ sorting, sortBy, sortingSettings, getId }),
    }, [sorting, ...deps]);

    if (isLoading || sortTree === null) {
        return tree;
    }

    return sortTree;
}
