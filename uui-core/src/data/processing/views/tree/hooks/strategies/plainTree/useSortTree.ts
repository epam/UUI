import { useEffect, useState } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState, SortingOption } from '../../../../../../../types';
import { ITree } from '../../..';
import isEqual from 'lodash.isequal';

export type UseSortTreeProps<TItem, TId, TFilter = any> = {
    sortBy?(item: TItem, sorting: SortingOption): any;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useSortTree<TItem, TId, TFilter = any>(
    {
        tree,
        dataSourceState: { sorting },
        sortBy,
    }: UseSortTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = usePrevious(tree);
    const prevSorting = usePrevious(sorting);

    const [sortedTree, setSortedTree] = useState<ITree<TItem, TId>>(
        tree.sort({ sorting, sortBy }),
    );

    useEffect(() => {
        if (!isEqual(sorting, prevSorting) || prevTree !== tree) {
            setSortedTree(tree.sort({ sorting, sortBy }));
        }
    }, [tree, sorting, ...deps]);

    return sortedTree;
}
