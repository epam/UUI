import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClientAsyncTreeProps } from './types';
import { Tree } from '../../../Tree';
import { usePlainTreeStrategy } from '../plainTree';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';

export function useClientAsyncTree<TItem, TId, TFilter = any>(
    { mode, ...props }: ClientAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const fullTree = useMemo(() => Tree.blank(props), deps);
    const [isForceReload, setIsForceReload] = useState(false);
    const prevIsForceReload = useSimplePrevious(isForceReload);

    const { tree: treeWithData, isLoading, isFetching } = useLoadData({
        api: () => props.api().then((items) => ({ items })),
        tree: fullTree,
        dataSourceState: {
            visibleCount: props.dataSourceState.visibleCount,
            topIndex: props.dataSourceState.topIndex,
        },
        forceReload: isForceReload,
    }, deps);

    const prevIsFetching = useSimplePrevious(isFetching);

    const { tree, ...restProps } = usePlainTreeStrategy(
        { ...props, items: treeWithData, type: 'plain' },
        [...deps, treeWithData],
    );

    useEffect(() => {
        if (prevIsForceReload !== isForceReload && isForceReload
                && prevIsFetching !== isFetching && !isFetching) {
            setIsForceReload(false);
        }
    }, [treeWithData]);

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [setIsForceReload]);

    return {
        tree,
        reload,
        isLoading,
        isFetching,
        ...restProps,
    };
}
