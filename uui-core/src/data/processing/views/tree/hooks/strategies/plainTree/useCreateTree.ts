import { useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { NewTree } from '../../../newTree';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeStrategyProps<TItem, TId, TFilter>, deps: any[]): NewTree<TItem, TId> {
    const { itemsMap, setItems, items } = props;
    const tree = useMemo(() => {
        return items instanceof NewTree
            ? NewTree.clone(items)
            : NewTree.create(props, itemsMap, setItems);
    }, [...deps, itemsMap]);

    return tree;
}
