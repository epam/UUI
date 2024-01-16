import { UseTreeResult } from './types';
import { ExtractTreeProps, TreeHook, UseTreeProps } from './strategies/types';
import { useMemo } from 'react';
import { strategies } from './strategies';

export function useTree<TItem, TId, TFilter = any>(props: UseTreeProps<TItem, TId, TFilter>, deps: any[]): UseTreeResult<TItem, TId, TFilter> {
    const { type = 'plain' } = props;

    const useStrategy: TreeHook<typeof type> = useMemo(
        () => strategies[type] as TreeHook<typeof type>,
        [type],
    );

    const tree = useStrategy<TItem, TId>(
        { ...props, type } as ExtractTreeProps<typeof type, TItem, TId>,
        [type, ...deps],
    );

    return tree;
}
