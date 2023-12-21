import { useMemo, useRef } from 'react';
import { useSimplePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../../../tree';

export type UseSearchTreeProps<TItem, TId, TFilter = any> = {
    getSearchFields?: (item: TItem) => string[];
    sortSearchByRelevance?: boolean;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSearchTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { search },
        getSearchFields,
        sortSearchByRelevance,
    }: UseSearchTreeProps<TItem, TId, TFilter>,
    deps: any[] = [],
) {
    const prevTree = useSimplePrevious(tree);
    const prevSearch = useSimplePrevious(search);
    const prevDeps = useSimplePrevious(deps);
    const searchTreeRef = useRef(null);

    return useMemo(() => {
        const isDepsChanged = prevDeps?.length !== deps.length || (prevDeps ?? []).some((devVal, index) => devVal !== deps[index]);
        if (searchTreeRef.current === null || prevTree !== tree || search !== prevSearch || isDepsChanged) {
            searchTreeRef.current = tree.search({ search, getSearchFields, sortSearchByRelevance });
        }
        return searchTreeRef.current;
    }, [tree, search, ...deps]);
}
