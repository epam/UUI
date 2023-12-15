import { useMemo } from 'react';
import { ExtractTreeStrategyProps, TreeStrategyHook, strategies } from './strategies';
import { UseTreeStrategyProps } from './types';

export function useTreeStrategy<TItem, TId>(props: UseTreeStrategyProps<TItem, TId>, deps: any[]) {
    const { type = 'plain' } = props;

    const useStrategy: TreeStrategyHook<typeof type> = useMemo(
        () => strategies[type] as TreeStrategyHook<typeof type>,
        [type],
    );

    const tree = useStrategy<TItem, TId>(
        { ...props, type } as ExtractTreeStrategyProps<typeof type, TItem, TId>,
        [type, ...deps],
    );

    return tree;
}
