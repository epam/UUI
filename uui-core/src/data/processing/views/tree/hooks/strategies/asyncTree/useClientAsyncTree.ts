import { useMemo } from 'react';
import { ClientAsyncTreeProps } from './types';
import { Tree } from '../../../Tree';
import { usePlainTreeStrategy } from '../plainTree';
import { useLoadData } from './useLoadData';

export function useClientAsyncTree<TItem, TId, TFilter = any>(
    { mode, ...props }: ClientAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const fullTree = useMemo(() => Tree.blank(props), deps);

    const { tree: treeWithData, isLoading } = useLoadData({
        api: () => props.api().then((items) => ({ items })),
        tree: fullTree,
        dataSourceState: {
            visibleCount: props.dataSourceState.visibleCount,
            topIndex: props.dataSourceState.topIndex,
        },
    }, deps);

    const { tree, ...restProps } = usePlainTreeStrategy(
        { ...props, items: treeWithData, type: 'plain' },
        [...deps, treeWithData],
    );

    return {
        tree,
        isLoading,
        isFetching: isLoading,
        ...restProps,
    };
}
