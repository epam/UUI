import { useMemo } from 'react';
import { strategies } from './strategies';
import { ExtractTreeStrategyProps, TreeStrategyHook, UseTreeStrategyProps } from './strategies/types';
import React from 'react';

export const SomeContext = React.createContext({ c: '1' });

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
