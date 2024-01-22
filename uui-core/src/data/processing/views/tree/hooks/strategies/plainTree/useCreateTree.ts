import { useMemo } from 'react';
import { PlainTreeProps } from './types';
import { TreeState } from '../../../newTree';

export function useCreateTree<TItem, TId, TFilter = any>(props: Omit<PlainTreeProps<TItem, TId, TFilter>, 'items'>, deps: any[]): TreeState<TItem, TId> {
    const { itemsMap, setItems } = props;
    const tree = useMemo(() => {
        return TreeState.createFromItems<TItem, TId>(props, itemsMap, setItems);
    }, [...deps, itemsMap]);

    return tree;
}
