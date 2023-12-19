import { useMemo } from 'react';
import { PlainTreeStrategyProps } from './types';
import { Tree } from '../../..';

export function useCreateTree<TItem, TId, TFilter = any>(props: PlainTreeStrategyProps<TItem, TId, TFilter>, deps: any[]) {
    const { items } = props;

    return useMemo(() => {
        return Tree.create(props, Array.isArray(items) ? items : Object.values(items));
    }, [items, ...deps]);
}
