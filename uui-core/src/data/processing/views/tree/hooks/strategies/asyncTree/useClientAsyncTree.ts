import { useCallback, useEffect, useMemo, useState } from 'react';
import { TreeState } from '../../../newTree';
import { ClientAsyncTreeProps } from './types';
import { usePlainTree } from '../plainTree';
import { useLoadData } from './useLoadData';
import { useSimplePrevious } from '../../../../../../../hooks';
import { useItemsStorage } from '../../useItemsStorage';

export function useClientAsyncTree<TItem, TId, TFilter = any>(
    { mode, ...props }: ClientAsyncTreeProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const { complexIds, getId } = props;
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        items: props.items,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const baseTree = useMemo(() => TreeState.blank(props, itemsMap, setItems), deps);
    const [isForceReload, setIsForceReload] = useState(false);
    const prevIsForceReload = useSimplePrevious(isForceReload);

    const { tree: treeWithData, itemsStatusCollector, isLoading, isFetching } = useLoadData({
        getId,
        complexIds,
        api: () => props.api().then((items) => ({ items })),
        tree: baseTree,
        dataSourceState: {
            visibleCount: props.dataSourceState.visibleCount,
            topIndex: props.dataSourceState.topIndex,
            checked: props.dataSourceState.checked,
            selectedId: props.dataSourceState.selectedId,
        },
        forceReload: isForceReload,
        showOnlySelected: props.showOnlySelected,
    }, [...deps, baseTree]);

    const prevIsFetching = useSimplePrevious(isFetching);

    const { tree, ...restProps } = usePlainTree(
        { ...props, itemsMap, setItems, items: treeWithData, type: 'plain' },
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
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        ...restProps,
    };
}
