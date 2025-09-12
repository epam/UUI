import { usePrevious } from '../../../../../../hooks/usePrevious';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../treeState';
import { useUpdateTreeState } from './useUpdateTreeState';

export type UseSearchTreeStateProps<TItem, TId, TFilter = any> = {
    getSearchFields?: (item: TItem) => string[];
    sortSearchByRelevance?: boolean;
    tree: TreeState<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSearchTreeState<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { search },
        getSearchFields,
        sortSearchByRelevance,
    }: UseSearchTreeStateProps<TItem, TId, TFilter>,
    deps: any[] = [],
) {
    const prevSearch = usePrevious(search);

    const searchTree = useUpdateTreeState({
        tree,
        shouldUpdate: () => !tree.isBlank() && search !== prevSearch,
        update: (currentTree) => currentTree.search({ search, getSearchFields, sortSearchByRelevance }),
    }, [search, ...deps]);

    if (tree === null || tree.isBlank()) {
        return tree;
    }

    return searchTree;
}
