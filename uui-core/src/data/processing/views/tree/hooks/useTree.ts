import { useMemo } from 'react';
import { UseTreeResult } from './types';
import { TreeHook, UseTreeProps } from './strategies/types';
import { usePrevious } from '../../../../../hooks/usePrevious';
import { strategies } from './strategies';

export function useTree<TItem, TId, TFilter = any>(props: UseTreeProps<TItem, TId, TFilter>, deps: any[]): UseTreeResult<TItem, TId, TFilter> {
    const prevType = usePrevious(props.type);

    if (prevType && props.type !== prevType) {
        throw new Error("Tree type can't be changed between renders");
    }

    const useStrategy: TreeHook<typeof props.type> = useMemo(
        () => strategies[props.type] as TreeHook<typeof props.type>,
        [props.type],
    );

    const tree = useStrategy<TItem, TId>(props, [...deps]);

    return tree;
}
