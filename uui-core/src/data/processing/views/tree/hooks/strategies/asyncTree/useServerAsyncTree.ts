import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePlainTree } from '../plainTree';
import { ServerAsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';
import { TreeState } from '../../../newTree';
import { useItemsStorage } from '../../common';

export function useServerAsyncTree<TItem, TId, TFilter = any>(
    props: ServerAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const { api, dataSourceState, getId, complexIds, showOnlySelected } = props;
    const [isForceReload, setIsForceReload] = useState(false);
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        params: { getId: props.getId, complexIds: props.complexIds },
    });

    const prevIsForceReload = useSimplePrevious(isForceReload);

    const baseTree = useMemo(() => TreeState.blank(props, itemsMap, setItems), deps);
    const [currentTree, setCurrentTree] = useState(baseTree);

    const { tree: treeWithData, itemsStatusCollector, isLoading, isFetching } = useLoadData({
        api,
        getId,
        complexIds,
        tree: currentTree,
        dataSourceState,
        forceReload: isForceReload,
        showOnlySelected,
    }, [
        ...deps,
        showOnlySelected,
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
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        ...restProps,
    };
}
