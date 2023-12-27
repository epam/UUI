import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tree } from '../../../Tree';
import { usePlainTreeStrategy } from '../plainTree';
import { ServerAsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';

export function useServerAsyncTree<TItem, TId, TFilter = any>(
    props: ServerAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const { api, dataSourceState } = props;
    const [isForceReload, setIsForceReload] = useState(false);

    const prevIsForceReload = useSimplePrevious(isForceReload);

    const baseTree = useMemo(() => Tree.blank(props), deps);
    const [fullTree, setFullTree] = useState(baseTree);
    const [visibleTree, setVisibleTree] = useState(fullTree);

    const { tree: treeWithData, isLoading, isFetching } = useLoadData({
        api,
        tree: fullTree,
        dataSourceState,
        forceReload: isForceReload,
    }, [
        ...deps,
        dataSourceState.search,
        dataSourceState.sorting,
        dataSourceState.filter,
    ]);

    const prevIsFetching = useSimplePrevious(isFetching);

    useEffect(() => {
        if (treeWithData !== visibleTree) {
            setVisibleTree(treeWithData);
            const newFullTree = dataSourceState.search ? fullTree.mergeItems(treeWithData) : treeWithData;
            setFullTree(newFullTree);
            if (prevIsForceReload !== isForceReload && isForceReload
                && prevIsFetching !== isFetching && !isFetching) {
                setIsForceReload(false);
            }
        }
    }, [treeWithData]);

    const { filter, sorting, search, ...restDataSourceState } = dataSourceState;
    const { tree, ...restProps } = usePlainTreeStrategy(
        {
            ...props,
            items: visibleTree,
            dataSourceState: restDataSourceState,
            type: 'plain',
        },
        [...deps, visibleTree],
    );

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
