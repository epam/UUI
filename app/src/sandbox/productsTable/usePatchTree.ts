import { ITree, usePrevious } from '@epam/uui-core';
import isEqual from 'lodash.isequal';
import { useEffect, useState } from 'react';

export interface UsePatchTree<TItem, TId> {
    tree: ITree<TItem, TId>;
    additionalRows: TItem[];
}

export function usePatchTree<TItem, TId>({ tree, additionalRows }: UsePatchTree<TItem, TId>) {
    const prevTree = usePrevious(tree);
    const prevRows = usePrevious(additionalRows);

    const [patchedTree, setPatchedTree] = useState<ITree<TItem, TId>>(tree);

    useEffect(() => {
        if (prevTree !== tree || !isEqual(additionalRows, prevRows)) {
            setPatchedTree(tree.patch(additionalRows, undefined, () => -1));
        }
    }, [tree, additionalRows, prevTree, prevRows]);

    return patchedTree;
}
