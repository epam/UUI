import { useCallback, useEffect, useMemo, useState } from 'react';
import { LazyTreeProps } from './types';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';

import isEqual from 'lodash.isequal';
import { onlySearchWasUnset, isQueryChanged } from './helpers';
import { useFoldingService } from '../../../../dataRows/services';
import { useLoadData } from './useLoadData';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../useDataSourceStateWithDefaults';
import { TreeState } from '../../../newTree';
import { useItemsStorage } from '../useItemsStorage';
import { usePatchTree } from '../usePatchTree';

export function useLazyTree<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...restProps }: LazyTreeProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { flattenSearchResults, ...restProps };
    const {
        api, filter, backgroundReload,
        isFoldedByDefault, getId, getParentId, setDataSourceState,
        cascadeSelection, getRowOptions, rowOptions,
        getChildCount, patchItems,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });
    const { itemsMap, setItems } = useItemsStorage({
        itemsMap: props.itemsMap,
        setItems: props.setItems,
        getId: props.getId,
    });

    const blankTree = useMemo(() => TreeState.blank(props, itemsMap, setItems), [...deps]);
    const [treeWithData, setTreeWithData] = useState(blankTree);

    const prevFilter = usePrevious(filter);
    const prevDataSourceState = usePrevious(dataSourceState);

    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForceReload, setIsForceReload] = useState(false);

    const actualRowsCount = useMemo(() => treeWithData.visible.getTotalRecursiveCount() ?? 0, [treeWithData.visible]);

    const lastRowIndex = dataSourceState.topIndex + dataSourceState.visibleCount;

    const areMoreRowsNeeded = useCallback((prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex
            || prevValue?.visibleCount !== newValue?.visibleCount;

        return isFetchPositionAndAmountChanged && lastRowIndex > actualRowsCount;
    }, [lastRowIndex, actualRowsCount]);

    const foldingService = useFoldingService({ dataSourceState, isFoldedByDefault, getId, setDataSourceState });

    useEffect(() => {
        setTreeWithData(blankTree);
    }, [blankTree]);

    const { loadMissing, loadMissingOnCheck } = useLoadData({
        api,
        filter,
        dataSourceState,
        isFolded: foldingService.isFolded,
        fetchStrategy: props.fetchStrategy,
        flattenSearchResults: props.flattenSearchResults,
        getChildCount: props.getChildCount,
        cascadeSelection,
    });

    const loadMissingRecords = useCallback(async (currentTree: TreeState<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => {
        const newTree = await loadMissingOnCheck(currentTree, id, isChecked, isRoot);
        if (currentTree !== newTree) {
            setTreeWithData(newTree);
        }
        return newTree;
    }, [loadMissingOnCheck, setTreeWithData, treeWithData]);

    useEffect(() => {
        let completeReset = false;
        const shouldReloadData = !isEqual(prevFilter, filter)
            || isQueryChanged(prevDataSourceState, dataSourceState)
            || isForceReload;

        let currentTree = treeWithData;
        if (prevDataSourceState == null || shouldReloadData) {
            setIsFetching(true);
            currentTree = treeWithData.clearStructure();
            if (onlySearchWasUnset(prevDataSourceState, dataSourceState)) {
                currentTree = currentTree.reset();
            }
            completeReset = true;
        }
        const isFoldingChanged = !prevDataSourceState || dataSourceState.folded !== prevDataSourceState.folded;
        const shouldShowPlacehodlers = (!shouldReloadData
            || (shouldReloadData && !backgroundReload)) && !isForceReload;

        const moreRowsNeeded = areMoreRowsNeeded(prevDataSourceState, dataSourceState);
        if ((completeReset && shouldShowPlacehodlers) || isFoldingChanged || moreRowsNeeded) {
            if (currentTree !== treeWithData) {
                setTreeWithData(currentTree);
            }
            setIsLoading(true);
        }

        if (completeReset || isFoldingChanged || moreRowsNeeded) {
            loadMissing({
                tree: currentTree,
                using: dataSourceState.search ? 'visible' : undefined,
                abortInProgress: completeReset,
            })
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
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
        isForceReload,
        dataSourceState,
        filter,
        treeWithData,
        setTreeWithData,
        areMoreRowsNeeded,
    ]);

    const tree = usePatchTree({
        tree: treeWithData,
        patchItems,
    });

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [props, setTreeWithData]);

    const pureTree = useMemo(() => TreeState.toPureTreeState(tree), [tree]);
    return {
        tree: pureTree,
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
        flattenSearchResults,
        isFetching,
        isLoading,
        loadMissingRecords,
    };
}
