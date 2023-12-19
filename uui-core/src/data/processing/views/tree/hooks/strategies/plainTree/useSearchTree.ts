import { useMemo, useRef } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../..';

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
    deps: any[],
) {
    const prevTree = usePrevious(tree);
    const prevSearch = usePrevious(search);
    const prevDeps = usePrevious(deps);
    const searchTreeRef = useRef(null);

    return useMemo(() => {
        if (searchTreeRef.current === null || prevTree !== tree || search !== prevSearch || prevDeps !== deps) {
            searchTreeRef.current = tree.search({ search, getSearchFields, sortSearchByRelevance });
        }
        return searchTreeRef.current;
    }, [tree, search, ...deps]);
}
