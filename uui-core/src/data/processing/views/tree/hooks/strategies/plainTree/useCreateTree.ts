import { useEffect, useState } from 'react';
import { PlainTreeStrategyProps } from './types';
import { ITree, Tree } from '../../..';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeStrategyProps<TItem, TId, TFilter>, deps: any[]) {
    const [tree, setTree] = useState<ITree<TItem, TId>>(Tree.blank(props));

    useEffect(() => {
        if (props.items) {
            setTree(Tree.create(props, props.items));
        }
    }, [props.items, ...deps]);

    return tree;
}
