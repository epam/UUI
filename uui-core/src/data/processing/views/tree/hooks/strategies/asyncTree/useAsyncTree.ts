import { useMemo } from 'react';
import { modes } from './modes';
import { AsyncTreeProps, ExtractTreeModeProps, TreeModeHook } from './types';

export function useAsyncTree<TItem, TId, TFilter = any>(
    { mode = 'client', ...props }: AsyncTreeProps<TItem, TId, TFilter>,
    deps: [],
) {
    const useAsyncTreeMode: TreeModeHook<typeof mode> = useMemo(
        () => modes[mode] as TreeModeHook<typeof mode>,
        [mode],
    );

    return useAsyncTreeMode(
        { ...props, mode } as ExtractTreeModeProps<typeof mode, TItem, TId, TFilter>,
        deps,
    );
}
