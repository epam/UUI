import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../hooks';
import { DataSourceState } from '../../../../../../types';
import { TreeState } from '../../newTree';

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
    const prevTree = useSimplePrevious(tree);
    const prevSearch = useSimplePrevious(search);
    const prevDeps = useSimplePrevious(deps);
    const searchTreeRef = useRef<TreeState<TItem, TId>>(null);

    const searchTree = useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (searchTreeRef.current === null || prevTree !== tree || search !== prevSearch || isDepsChanged) {
            searchTreeRef.current = tree.search({ search, getSearchFields, sortSearchByRelevance });
        }
        return searchTreeRef.current;
    }, [tree, search, ...deps]);

    if (isLoading) {
        return tree;
    }

    return searchTree;
}
