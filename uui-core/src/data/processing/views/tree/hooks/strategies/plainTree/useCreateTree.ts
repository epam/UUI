import { useEffect, useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { NewTree } from '../../../newTree';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeStrategyProps<TItem, TId, TFilter>, deps: any[]): NewTree<TItem, TId> {
    const { itemsMap, setItems } = props;
    const tree = useMemo(() => {
        return NewTree.create(props, itemsMap, setItems);
    }, deps);

    useEffect(() => {
        tree.itemsMap = itemsMap;
    }, [itemsMap]);

    return tree;
}
