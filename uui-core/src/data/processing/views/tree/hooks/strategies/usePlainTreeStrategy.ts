import { useMemo } from 'react';
import { Tree } from '../../Tree';
import { PlainTreeStrategyProps } from './types';

export function usePlainTreeStrategy<TItem, TId>({ items, ...props }: PlainTreeStrategyProps<TItem, TId>, deps: any[]) {
    const tree = useMemo(() => Tree.create(props, items), deps);
    return tree;
}
