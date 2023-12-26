import { useMemo } from 'react';
import { modes } from './modes';
import { AsyncTreeStrategyProps, ExtractTreeModeProps, TreeModeHook } from './types';

export function useAsyncTreeStrategy<TItem, TId, TFilter = any>(
    { mode = 'client', ...props }: AsyncTreeStrategyProps<TItem, TId, TFilter>,
    deps: [],
) {
    const useAsyncTree: TreeModeHook<typeof mode> = useMemo(
        () => modes[mode] as TreeModeHook<typeof mode>,
        [mode],
    );

    return useAsyncTree(
        { ...props, mode } as ExtractTreeModeProps<typeof mode, TItem, TId, TFilter>,
        deps,
    );
}
