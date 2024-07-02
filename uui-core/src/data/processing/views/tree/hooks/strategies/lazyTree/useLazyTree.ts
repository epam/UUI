import { useCallback, useEffect, useMemo, useState } from 'react';
import { LazyTreeProps } from './types';
import { usePrevious } from '../../../../../../../hooks/usePrevious';
import { useFoldingService } from '../../../../dataRows/services';
import { useLoadData } from './useLoadData';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults, useSelectedOnlyTree, useItemsStorage, usePatchTree, useItemsStatusCollector } from '../../common';
import { TreeState } from '../../../treeState';
import { useLazyFetchingAdvisor } from './useLazyFetchingAdvisor';
import { isSelectedOrCheckedChanged } from '../checked';
import { useActualItemsMap } from '../../common';

export function useLazyTree<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...restProps }: LazyTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { flattenSearchResults, ...restProps };
    const {
        filter, backgroundReload, showSelectedOnly,
        isFoldedByDefault, getId, getParentId, setDataSourceState,
        cascadeSelection, getRowOptions, rowOptions, selectAll, fetchStrategy,
        getChildCount, itemsStatusMap, complexIds, patch, isDeleted, getNewItemPosition, sortBy,
        fixItemBetweenSortings, getItemTemporaryOrder,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const itemsStatusCollector = useItemsStatusCollector({
        itemsStatusCollector: props.itemsStatusCollector,
        itemsStatusMap,
        complexIds,
        getId,
        dataSourceState,
        patch,
    }, [itemsStatusMap, props.itemsStatusCollector]);

    const api = useMemo(
        () => itemsStatusCollector.watch(props.api),
        [itemsStatusCollector, props.api],
    );

    const blankTree = useMemo(
        () => TreeState.blank({ getId, getParentId, getChildCount, complexIds }, itemsMap, setItems),
        deps,
    );

    const [treeWithData, setTreeWithData] = useState(blankTree);

    const prevDataSourceState = usePrevious(dataSourceState);

    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForceReload, setIsForceReload] = useState(false);

    const { isFolded } = useFoldingService({
        getId,
        isFoldedByDefault,
        dataSourceState,
        setDataSourceState,
    });

    useEffect(() => {
        setTreeWithData(blankTree);
    }, [blankTree]);

    const { loadMissing, loadMissingOnCheck } = useLoadData({
        api,
        filter,
        dataSourceState,
        isFolded,
        fetchStrategy,
        flattenSearchResults,
        getChildCount,
        cascadeSelection,
    });

    const loadMissingRecordsOnCheck = useCallback(async (id: TId, isChecked: boolean, isRoot: boolean) => {
        const newTree = await loadMissingOnCheck(tree, id, isChecked, isRoot);
        if (tree !== treeWithData || tree !== newTree) {
            setTreeWithData(newTree);
        }

        return newTree.full;
    }, [loadMissingOnCheck, setTreeWithData, treeWithData]);

    const { shouldRefetch, shouldLoad, shouldFetch } = useLazyFetchingAdvisor({
        dataSourceState,
        filter,
        forceReload: isForceReload,
        backgroundReload,
        showSelectedOnly,
    }, [...deps]);

    const treeWithDataActual = useActualItemsMap({
        tree: treeWithData,
        itemsMap,
    });

    useEffect(() => {
        if (showSelectedOnly && isSelectedOrCheckedChanged(dataSourceState, prevDataSourceState)) {
            loadMissing({
                tree: treeWithDataActual,
                using: 'full',
                abortInProgress: shouldRefetch,
                dataSourceState: {
                    visibleCount: 0,
                    topIndex: 0,
                },
            })
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (!isOutdated && (isUpdated || newTree !== treeWithDataActual)) {
                        setTreeWithData(newTree);
                    }
                });
        }
    }, [showSelectedOnly, dataSourceState.checked, dataSourceState.selectedId]);

    useEffect(() => {
        if (showSelectedOnly) {
            return;
        }

        let currentTree = treeWithDataActual;
        if (shouldRefetch) {
            setIsFetching(true);
            currentTree = treeWithDataActual.clearStructure();
        }

        if (shouldLoad) {
            if (currentTree !== treeWithDataActual) {
                setTreeWithData(currentTree);
            }
            setIsLoading(true);
        }

        if (shouldFetch) {
            loadMissing({
                tree: currentTree,
                using: 'visible',
                abortInProgress: shouldRefetch,
            })
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (!isOutdated && (isUpdated || newTree !== treeWithDataActual)) {
                        setTreeWithData(newTree);
                    }
                }).finally(() => {
                    setIsFetching(false);
                    setIsLoading(false);
                    if (isForceReload === true) {
                        setIsForceReload(false);
                    }
                });
        }
    }, [
        showSelectedOnly,
        shouldFetch,
        shouldLoad,
        shouldRefetch,
    ]);

    const treeWithSelectedOnly = useSelectedOnlyTree({
        tree: treeWithDataActual,
        dataSourceState,
        isLoading: isLoading || isFetching,
    }, [treeWithDataActual]);

    const treeWithNewItemsMap = useActualItemsMap({
        tree: treeWithSelectedOnly,
        itemsMap,
    });

    const { tree, patch: patchFn } = usePatchTree({
        tree: treeWithNewItemsMap,
        patch: showSelectedOnly ? null : patch,
        isDeleted,
        getNewItemPosition,
        getItemTemporaryOrder,
        fixItemBetweenSortings,
        sorting: dataSourceState.sorting,
        sortBy,
    });

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [props, setTreeWithData]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.();
    }, [tree.visible]);

    return {
        tree: showSelectedOnly ? tree.selectedOnly : tree.visible,
        treeWithoutPatch: treeWithSelectedOnly.visible,
        selectionTree: tree.full,
        totalCount,
        dataSourceState,
        setDataSourceState,
        isFoldedByDefault,
        getId,
        getParentId,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        reload,
        isFetching,
        isLoading,
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        flattenSearchResults,
        loadMissingRecordsOnCheck,
        showSelectedOnly,
        selectAll,
        patch: patchFn,
    };
}
