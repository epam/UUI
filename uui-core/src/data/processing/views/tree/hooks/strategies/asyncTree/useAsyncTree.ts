import { useCallback, useEffect, useMemo, useState } from 'react';
import { TreeState } from '../../../treeState';
import { AsyncTreeProps } from './types';
import { useLoadData } from './useLoadData';
import { usePrevious } from '../../../../../../../hooks/usePrevious';
import {
    useItemsStorage, useDataSourceStateWithDefaults, useSortTreeState,
    useSearchTreeState, useSelectedOnlyTree, usePatchTree,
    useActualItemsStorage,
    useFilterTreeState,
} from '../../common';
import { UseTreeResult } from '../../types';

export function useAsyncTree<TItem, TId, TFilter = any>(
    props: AsyncTreeProps<TItem, TId, TFilter>,
    deps: [],
): UseTreeResult<TItem, TId, TFilter> {
    const {
        getId,
        complexIds,
        getParentId,
        getFilter,
        getSearchFields,
        sortBy,
        sortSearchByRelevance = true,
        rowOptions,
        getRowOptions,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showSelectedOnly,
        patch,
        isDeleted,
        getNewItemPosition,
        itemsStatusMap,
        selectAll,
        isLoaded,
        getItemTemporaryOrder,
        fixItemBetweenSortings,
    } = props;

    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const [isForceReload, setIsForceReload] = useState(false);

    const baseTree = useMemo(() => {
        if (isLoaded) {
            return TreeState.createFromItemsMap(itemsMap, setItems, { getId, getParentId, complexIds });
        }
        return TreeState.blank({ getId, getParentId, complexIds }, itemsMap, setItems);
    }, [...deps, isLoaded]);

    const [incommingTree, setIncommingTree] = useState(baseTree);

    const prevIsForceReload = usePrevious(isForceReload);
    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    useEffect(() => {
        setIncommingTree(baseTree);
    }, [baseTree]);

    const { tree: treeWithData, itemsStatusCollector, isLoading, isFetching } = useLoadData({
        getId,
        complexIds,
        api: () => props.api().then((items) => ({ items })),
        tree: incommingTree,
        dataSourceState: {
            visibleCount: dataSourceState.visibleCount,
            topIndex: dataSourceState.topIndex,
            checked: dataSourceState.checked,
            selectedId: dataSourceState.selectedId,
        },
        itemsStatusCollector: props.itemsStatusCollector,
        forceReload: isForceReload,
        onForceReloadComplete: () => setIsForceReload(false),
        showSelectedOnly,
        isLoaded,
        itemsStatusMap,
    }, [...deps, isForceReload, incommingTree]);

    const actualTree = useActualItemsStorage({ tree: treeWithData, itemsMap, setItems });

    const prevIsFetching = usePrevious(isFetching);

    useEffect(() => {
        if (prevIsForceReload !== isForceReload && isForceReload
                && prevIsFetching !== isFetching && !isFetching) {
            setIsForceReload(false);
        }
    }, [actualTree]);

    const reload = useCallback(() => {
        setIncommingTree(TreeState.blank({ getId, getParentId, complexIds }, itemsMap, setItems));
        setIsForceReload(true);
    }, [setIsForceReload]);

    const filteredTree = useFilterTreeState(
        { tree: actualTree, getFilter, dataSourceState },
        [actualTree],
    );

    const sortTree = useSortTreeState(
        { tree: filteredTree, sortBy, dataSourceState },
        [filteredTree],
    );

    const searchTree = useSearchTreeState(
        {
            tree: sortTree,
            getSearchFields,
            sortSearchByRelevance,
            dataSourceState,
        },
        [sortTree],
    );

    const treeWithSelectedOnly = useSelectedOnlyTree({
        tree: searchTree,
        dataSourceState,
    }, [searchTree]);

    const treeWithNewItemsMap = useActualItemsStorage({
        tree: treeWithSelectedOnly,
        itemsMap,
        setItems,
    });

    const { tree, applyPatch } = usePatchTree({
        tree: treeWithNewItemsMap,
        patch: showSelectedOnly ? null : patch,
        isDeleted,
        getNewItemPosition,
        getItemTemporaryOrder,
        fixItemBetweenSortings,
        sorting: dataSourceState.sorting,
        sortBy,
    });

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    return {
        tree: showSelectedOnly ? tree.selectedOnly : tree.visible,
        treeWithoutPatch: treeWithNewItemsMap.visible,
        selectionTree: tree.full,
        reload,
        totalCount,
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        rowOptions,
        getRowOptions,
        getParentId,
        getId,
        dataSourceState,
        setDataSourceState,
        isFoldedByDefault,
        cascadeSelection,
        showSelectedOnly,
        selectAll,
        applyPatch,

        isLoading,
        isFetching,
    };
}
