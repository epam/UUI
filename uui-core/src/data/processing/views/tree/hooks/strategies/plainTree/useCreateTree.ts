import { useMemo } from 'react';
import { PlainTreeProps } from './types';
import { TreeState } from '../../../newTree';

export interface UseCreateTreeProps<TItem, TId, TFilter = any> extends Omit<PlainTreeProps<TItem, TId, TFilter>, 'items'> {
    items?: TItem[] | TreeState<TItem, TId>;
}

export function useCreateTree<TItem, TId, TFilter = any>(props: UseCreateTreeProps<TItem, TId, TFilter>, deps: any[]): TreeState<TItem, TId> {
    const { items, itemsMap, setItems } = props;
    const tree = useMemo(() => {
        if (items instanceof TreeState) {
            return items;
        }

        return TreeState.createFromItems<TItem, TId>(items, itemsMap, props, setItems);
    }, [...deps, itemsMap]);

    return tree;
}
