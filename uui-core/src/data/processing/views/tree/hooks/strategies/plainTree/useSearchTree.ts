import { useEffect, useState } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../..';
import isEqual from 'lodash.isequal';

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

    const [searchTree, setSearchTree] = useState<ITree<TItem, TId>>(
        tree.search({ search, getSearchFields, sortSearchByRelevance }),
    );

    useEffect(() => {
        if (!isEqual(search, prevSearch) || prevTree !== tree) {
            setSearchTree(tree.search({ search, getSearchFields, sortSearchByRelevance }));
        }
    }, [tree, search, ...deps]);

    return searchTree;
}
