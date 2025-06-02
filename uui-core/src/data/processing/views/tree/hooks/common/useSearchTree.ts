import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../types';
import { ITree } from '../../ITree';
import { SearchHelper } from '../../treeStructure';
import { CreateTreeInstance } from '../../treeStructure/helpers/types';
import { useUpdateTree } from './useUpdateTree';

export interface UseSearchTreeProps<TItem, TId, TFilter = any> extends CreateTreeInstance<TItem, TId> {
    getSearchFields?: (item: TItem) => string[];
    sortSearchByRelevance?: boolean;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
}

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
