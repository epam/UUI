import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState, FilterConfig } from '../../../../../../types';
import { ITree } from '../../ITree';
import { FilterHelper } from '../../treeStructure';
import { CreateTreeInstance } from '../../treeStructure/helpers/types';
import { useUpdateTree } from './useUpdateTree';

/**
 * Filter tree hook props.
 */
export interface UseFilterTreeProps<TItem, TId, TFilter = any> extends FilterConfig<TItem, TFilter>, CreateTreeInstance<TItem, TId> {
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
 * Filters tree by criteria.
 * @returns tree without filtered records.
 */
export function useFilterTree<TItem, TId, TFilter = any>(
    { tree, newTreeInstance, dataSourceState: { filter }, getFilter, isLoading }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevFilter = usePrevious(filter);
    const filteredTree = useUpdateTree({
        tree,
        shouldUpdate: () => filter !== prevFilter,
        update: (currentTree) => FilterHelper.filter({ tree: currentTree, filter, getFilter, newTreeInstance }),
    }, [filter, ...deps]);

    if (isLoading || filteredTree === null) {
        return tree;
    }

    return filteredTree;
}
