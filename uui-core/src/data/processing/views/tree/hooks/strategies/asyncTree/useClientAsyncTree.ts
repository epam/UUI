import { useMemo, useState } from 'react';
import { ClientAsyncTreeProps } from './types';
import { Tree } from '../../../Tree';
import { usePlainTreeStrategy } from '../plainTree';
import { useLoadData } from './useLoadData';

export function useClientAsyncTree<TItem, TId, TFilter = any>(
    { mode, ...props }: ClientAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const [isLoading, setIsLoading] = useState(false);
    const fullTree = useMemo(() => Tree.blank(props), deps);
    const [currentTree, setCurrentTree] = useState(fullTree);

    useLoadData({
        api: () => props.api().then((items) => ({ items })),
        tree: currentTree,
        dataSourceState: {
            visibleCount: props.dataSourceState.visibleCount,
            topIndex: props.dataSourceState.topIndex,
        },
        onStart: () => setIsLoading(true),
        onComplete: ({ isOutdated, isUpdated, tree }) => {
            if (!isOutdated && isUpdated && currentTree !== tree) {
                setCurrentTree(tree);
            }
            setIsLoading(false);
        },
        onError: () => setIsLoading(false),
    }, deps);

    const { tree, ...restProps } = usePlainTreeStrategy(
        { ...props, items: currentTree, type: 'plain' },
        [...deps, currentTree],
    );

    return {
        tree,
        isLoading,
        isFetching: isLoading,
        ...restProps,
    };
}
