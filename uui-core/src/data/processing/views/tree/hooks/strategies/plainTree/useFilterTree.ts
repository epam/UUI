import { useEffect, useState } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';
import { ITree } from '../../..';
import isEqual from 'lodash.isequal';

export type UseFilterTreeProps<TItem, TId, TFilter = any> = {
    getFilter?: (filter: TFilter) => (item: TItem) => boolean;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
};

export function useFilterTree<TItem, TId, TFilter = any>(
    { tree, dataSourceState: { filter }, getFilter }: UseFilterTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const prevTree = usePrevious(tree);
    const prevFilter = usePrevious(filter);

    const [filteredTree, setFilteredTree] = useState<ITree<TItem, TId>>(tree.filter({ filter, getFilter }));

    useEffect(() => {
        if (prevTree !== tree || !isEqual(filter, prevFilter)) {
            setFilteredTree(tree.filter({ filter, getFilter }));
        }
    }, [tree, filter, ...deps]);

    return filteredTree;
}
