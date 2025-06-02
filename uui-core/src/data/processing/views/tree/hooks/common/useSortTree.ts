import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState, SortConfig } from '../../../../../../types';
import { ITree } from '../../ITree';
import { SortHelper } from '../../treeStructure';
import { CreateTreeInstance } from '../../treeStructure/helpers/types';
import { useUpdateTree } from './useUpdateTree';

/**
 * Sort tree hook props.
 */
export interface UseSortTreeProps<TItem, TId, TFilter = any> extends SortConfig<TItem>, CreateTreeInstance<TItem, TId> {
    /**
     * Tree with data.
     */
    tree: ITree<TItem, TId>;
    /**
     * State of the dataSource.
     */
    dataSourceState: DataSourceState<TFilter, TId>;
    /**
     * Are data loading.
     */
    isLoading?: boolean;
}

/**
 * Sorts tree by criteria.
 * @returns tree with sorted records.
 */
export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
        newTreeInstance,
        isLoading,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
): ITree<TItem, TId> {
    const prevSorting = usePrevious(sorting);

    const sortTree = useUpdateTree({
        tree,
        shouldUpdate: () => sorting !== prevSorting,
        update: (currentTree) => SortHelper.sort({ tree: currentTree, sorting, sortBy, newTreeInstance }),
    }, [sorting, ...deps]);

    if (isLoading || sortTree === null) {
        return tree;
    }

    return sortTree;
}
