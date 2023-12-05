import { useMemo } from 'react';
import { Tree } from '../Tree';

export function useTree<TItem, TId, TFilter = any>({ items, ...params }: any, deps: any[]) {
    const tree = useMemo(
        () => Tree.create<TItem, TId>(items, params),
        deps,
    );

    return tree;
}
