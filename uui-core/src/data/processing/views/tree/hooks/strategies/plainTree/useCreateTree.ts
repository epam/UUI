import { useMemo } from 'react';
import { PlainTreeProps } from './types';
import { TreeState } from '../../../newTree';

export interface UseCreateTreeProps<TItem, TId, TFilter = any> extends Pick<
PlainTreeProps<TItem, TId, TFilter>,
'itemsMap' | 'setItems' | 'complexIds' | 'getId' | 'getParentId'
> {
    items?: TItem[] | TreeState<TItem, TId>;
}

export function useCreateTree<TItem, TId, TFilter = any>(
    props: UseCreateTreeProps<TItem, TId, TFilter>,
    deps: any[],
): TreeState<TItem, TId> {
    const { items, itemsMap, setItems, complexIds, getId, getParentId } = props;
    const tree = useMemo(() => {
        if (items instanceof TreeState) {
            return items;
        }

        return TreeState.createFromItems<TItem, TId>(
            items,
            itemsMap,
            { getId, getParentId, complexIds },
            setItems,
        );
    }, [...deps, itemsMap]);

    return tree;
}
