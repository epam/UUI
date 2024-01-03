import { useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { NewTree } from '../../../newTree';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeStrategyProps<TItem, TId, TFilter>, deps: any[]): NewTree<TItem, TId> {
    const { items } = props;

    return useMemo(() => {
        if (items instanceof NewTree) {
            return items;
        }

        return NewTree.create(props, Array.isArray(items) ? items : Object.values(items));
    }, [items, ...deps]);
}
