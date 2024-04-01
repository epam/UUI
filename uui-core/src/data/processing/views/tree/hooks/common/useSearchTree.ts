import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { useUpdateTree } from './useUpdateTree';

export type UseSearchTreeProps<TItem, TId, TFilter = any> = {
    getSearchFields?: (item: TItem) => string[];
    sortSearchByRelevance?: boolean;
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    isLoading?: boolean;
};

export function useSearchTree<TItem, TId, TFilter = any>(
    {
        tree,
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
        update: (currentTree) => currentTree.search({ search, getSearchFields, sortSearchByRelevance }),
    }, [search, ...deps]);

    if (isLoading || searchTree === null) {
        return tree;
    }

    return searchTree;
}
