import { NewTree, usePrevious } from '@epam/uui-core';
import isEqual from 'lodash.isequal';
import { useEffect, useState } from 'react';

export interface UsePatchTree<TItem, TId> {
    tree: NewTree<TItem, TId>;
    additionalRows: TItem[];
}

export function usePatchTree<TItem, TId>({ tree, additionalRows }: UsePatchTree<TItem, TId>) {
    const prevTree = usePrevious(tree);
    const prevRows = usePrevious(additionalRows);

    const [patchedTree, setPatchedTree] = useState<NewTree<TItem, TId>>(tree);

    useEffect(() => {
        if (prevTree !== tree || !isEqual(additionalRows, prevRows)) {
            setPatchedTree(tree.patch({ items: additionalRows, comparator: () => -1 }));
        }
    }, [tree, additionalRows, prevTree, prevRows]);

    return patchedTree;
}
