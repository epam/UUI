import { useMemo } from 'react';
import { PlainTreeProps } from './types';
import { TreeState } from '../../../newTree';

export interface UseCreateTreeProps<TItem, TId, TFilter = any> extends Omit<PlainTreeProps<TItem, TId, TFilter>, 'items'> {
    items?: TItem[] | TreeState<TItem, TId>;
}

export function useCreateTree<TItem, TId, TFilter = any>(props: UseCreateTreeProps<TItem, TId, TFilter>, deps: any[]): TreeState<TItem, TId> {
    const { items, itemsMap, setItems } = props;
    const tree = useMemo(() => {
        return items instanceof TreeState
            ? items
            : TreeState.createFromItems<TItem, TId>(items, itemsMap, props, setItems);
    }, [...deps, itemsMap]);

    return tree;
}
