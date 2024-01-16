import { useEffect, useMemo } from 'react';
import { PlainTreeProps } from './types';
import { NewTree } from '../../../newTree';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeProps<TItem, TId, TFilter>, deps: any[]): NewTree<TItem, TId> {
    const { itemsMap, setItems, items } = props;
    const tree = useMemo(() => {
        return items instanceof NewTree
            ? NewTree.clone(items)
            : NewTree.create(props, itemsMap, setItems);
    }, deps);

    useEffect(() => {
        if (itemsMap) {
            tree.itemsMap = itemsMap;
        }
    }, [tree?.itemsMap]);
    return tree;
}
