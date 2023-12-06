import { useMemo } from 'react';
import { strategies } from './strategies';
import { UseTreeStrategyProps } from './types';

export function useTreeStrategy<TItem, TId>({ type = 'plain', ...props }: UseTreeStrategyProps<TItem, TId>, deps: any[]) {
    const useStrategy = useMemo(
        () => strategies[type],
        [type],
    );

    const tree = useStrategy(
        { ...props, type },
        [type, ...deps],
    );

    return tree;
}
