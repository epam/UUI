import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePlainTree } from '../plainTree';
import { ServerAsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';
import { TreeState } from '../../../newTree';
import { useItemsStorage } from '../useItemsStorage';

export function useServerAsyncTree<TItem, TId, TFilter = any>(
    props: ServerAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const { api, dataSourceState } = props;
    const [isForceReload, setIsForceReload] = useState(false);
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        getId: props.getId,
    });

    const prevIsForceReload = useSimplePrevious(isForceReload);

    const baseTree = useMemo(() => TreeState.blank(props, itemsMap, setItems), deps);
    const [currentTree, setCurrentTree] = useState(baseTree);

    const { tree: treeWithData, isLoading, isFetching } = useLoadData({
        api,
        tree: currentTree,
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
        if (treeWithData !== currentTree) {
            setCurrentTree(treeWithData);

            if (prevIsForceReload !== isForceReload && isForceReload
                && prevIsFetching !== isFetching && !isFetching) {
                setIsForceReload(false);
            }
        }
    }, [treeWithData]);

    const { filter, sorting, search, ...restDataSourceState } = dataSourceState;
    const { tree, ...restProps } = usePlainTree(
        {
            ...props,
            items: currentTree,
            dataSourceState: restDataSourceState,
            itemsMap,
            setItems,
            type: 'plain',
        },
        [...deps, currentTree],
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
