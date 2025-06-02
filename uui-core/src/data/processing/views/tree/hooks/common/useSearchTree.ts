import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState, SearchConfig } from '../../../../../../types';
import { ITree } from '../../ITree';
import { SearchHelper } from '../../treeStructure';
import { CreateTreeInstance } from '../../treeStructure/helpers/types';
import { useUpdateTree } from './useUpdateTree';

/**
 * Search tree hook props.
 */
export interface UseSearchTreeProps<TItem, TId, TFilter = any> extends SearchConfig<TItem>, CreateTreeInstance<TItem, TId> {
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
 * Search tree by criteria.
 * @returns tree with search-matching records.
 */
export function useSearchTree<TItem, TId, TFilter = any>(
    {
        tree,
        newTreeInstance,
        dataSourceState: { search },
        getSearchFields,
        sortSearchByRelevance,
        isLoading,
    }: UseSearchTreeProps<TItem, TId, TFilter>,
    deps: any[] = [],
) {
    const prevSearch = usePrevious(search);

    const searchTree = useUpdateTree({
        tree,
        shouldUpdate: () => search !== prevSearch,
        update: (currentTree) => SearchHelper.search({
            tree: currentTree,
            newTreeInstance,
            search,
            getSearchFields,
            sortSearchByRelevance,
        }),
    }, [search, ...deps]);

    if (isLoading || searchTree === null) {
        return tree;
    }

    return searchTree;
}
