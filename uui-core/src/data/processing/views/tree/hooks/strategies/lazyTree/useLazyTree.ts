import { useCallback, useEffect, useMemo, useState } from 'react';
import { LazyTreeProps } from './types';
import { useSimplePrevious } from '../../../../../../../hooks';
import { onlySearchWasUnset } from './helpers';
import { useFoldingService } from '../../../../dataRows/services';
import { useLoadData } from './useLoadData';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../../useDataSourceStateWithDefaults';
import { TreeState } from '../../../newTree';
import { useItemsStorage } from '../../useItemsStorage';
import { usePatchTree } from '../../usePatchTree';
import { useLazyFetchingAdvisor } from './useLazyFetchingAdvisor';
import { useItemsStatusCollector } from '../../useItemsStatusCollector';
import isEqual from 'lodash.isequal';

export function useLazyTree<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...restProps }: LazyTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { flattenSearchResults, ...restProps };
    const {
        filter, backgroundReload, showOnlySelected,
        isFoldedByDefault, getId, getParentId, setDataSourceState,
        cascadeSelection, getRowOptions, rowOptions,
        getChildCount, patchItems, itemsStatusMap, complexIds,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        params: { getId, complexIds },
    });

    const itemsStatusCollector = useItemsStatusCollector({ itemsStatusMap, complexIds, getId }, []);

    const api = useMemo(
        () => itemsStatusCollector.watch(props.api),
        [itemsStatusCollector, props.api],
    );

    const blankTree = useMemo(() => TreeState.blank(props, itemsMap, setItems), deps);
    const [treeWithData, setTreeWithData] = useState(blankTree);

    const prevDataSourceState = useSimplePrevious(dataSourceState);
    const prevShowOnlySelected = useSimplePrevious(showOnlySelected);

    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForceReload, setIsForceReload] = useState(false);

    const { isFolded } = useFoldingService({ dataSourceState, isFoldedByDefault, getId, setDataSourceState });

    useEffect(() => {
        setTreeWithData(blankTree);
    }, [blankTree]);

    const { loadMissing, loadMissingOnCheck } = useLoadData({
        api,
        filter,
        dataSourceState,
        isFolded,
        fetchStrategy: props.fetchStrategy,
        flattenSearchResults: props.flattenSearchResults,
        getChildCount: props.getChildCount,
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
    });

    useEffect(() => {
        if (
            showOnlySelected
            && (
                dataSourceState.checked?.length && !isEqual(prevDataSourceState?.checked, dataSourceState.checked)
            )
        ) {
            itemsStatusCollector.setPending(dataSourceState.checked);

            loadMissing({
                tree: treeWithData,
                using: 'full',
                abortInProgress: shouldRefetch,
                dataSourceState: {
                    visibleCount: 0,
                    topIndex: 0,
                },
            })
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (!isOutdated && (isUpdated || newTree !== treeWithData)) {
                        setTreeWithData(newTree);
                    }
                });
        }
    }, [showOnlySelected, dataSourceState.checked]);

    useEffect(() => {
        let currentTree = treeWithData;
        if (shouldRefetch) {
            setIsFetching(true);
            currentTree = treeWithData.clearStructure();
            if (onlySearchWasUnset(prevDataSourceState, dataSourceState)) {
                currentTree = currentTree.reset();
            }
        }

        if (shouldLoad) {
            if (currentTree !== treeWithData) {
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
                    if (!isOutdated && (isUpdated || newTree !== treeWithData)) {
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
    }, [shouldFetch, shouldLoad, shouldRefetch, treeWithData, setTreeWithData]);

    useEffect(() => {
        if (
            showOnlySelected && (prevShowOnlySelected !== showOnlySelected
            || !isEqual(dataSourceState?.checked, prevDataSourceState?.checked))
        ) {
            const newTree = treeWithData.buildSelectedOnly(dataSourceState.checked);
            setTreeWithData(newTree);
        }
    }, [showOnlySelected, dataSourceState.checked, itemsMap]);

    const tree = usePatchTree({
        tree: treeWithData,
        patchItems: showOnlySelected ? null : patchItems,
    });

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [props, setTreeWithData]);

    const totalCount = useMemo(() => {
        const { totalCount: rootTotalCount } = tree.visible.getItems(undefined);

        return rootTotalCount ?? tree.visible.getTotalCount?.() ?? 0;
    }, [tree.visible]);

    console.log('treeWithData---->', treeWithData);
    return {
        tree: showOnlySelected ? tree.selectedOnly : tree.visible,
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
        getChildCount,
        reload,
        isFetching,
        isLoading,
        getItemStatus: itemsStatusCollector.getItemStatus(itemsMap),
        loadMissingRecordsOnCheck,
        showOnlySelected,
    };
}
