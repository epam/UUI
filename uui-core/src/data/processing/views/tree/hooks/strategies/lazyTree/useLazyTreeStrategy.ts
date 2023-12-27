import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tree } from '../../../Tree';
import { LazyTreeStrategyProps } from './types';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';

import isEqual from 'lodash.isequal';
import { onlySearchWasUnset, isQueryChanged } from './helpers';
import { useFoldingService } from '../../../../dataRows/services';
import { useLoadData } from './useLoadData';
import { UseTreeResult } from '../../types';
import { useDataSourceStateWithDefaults } from '../useDataSourceStateWithDefaults';
import { ITree } from '../../../ITree';

export function useLazyTreeStrategy<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...restProps }: LazyTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
): UseTreeResult<TItem, TId, TFilter> {
    const props = { flattenSearchResults, ...restProps };
    const {
        api, filter, backgroundReload,
        isFoldedByDefault, getId, setDataSourceState,
        cascadeSelection, getRowOptions, rowOptions,
        getChildCount,
    } = props;

    const dataSourceState = useDataSourceStateWithDefaults({ dataSourceState: props.dataSourceState });

    const tree = useMemo(() => Tree.blank(props), [...deps]);
    const [treeWithData, setTreeWithData] = useState(tree);
    const [fullTree, setFullTree] = useState(treeWithData);

    const prevFilter = usePrevious(filter);
    const prevDataSourceState = usePrevious(dataSourceState);

    const [isFetching, setIsFetching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForceReload, setIsForceReload] = useState(false);

    const actualRowsCount = useMemo(() => treeWithData.getTotalRecursiveCount() ?? 0, [treeWithData]);

    const lastRowIndex = dataSourceState.topIndex + dataSourceState.visibleCount;

    const areMoreRowsNeeded = useCallback((prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex
            || prevValue?.visibleCount !== newValue?.visibleCount;

        return isFetchPositionAndAmountChanged && lastRowIndex > actualRowsCount;
    }, [lastRowIndex, actualRowsCount]);

    const foldingService = useFoldingService({ dataSourceState, isFoldedByDefault, getId, setDataSourceState });

    useEffect(() => {
        setTreeWithData(tree);
    }, [tree]);

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

    const loadMissingRecords = useCallback(async (currentTree: ITree<TItem, TId>, id: TId, isChecked: boolean, isRoot: boolean) => {
        const newTree = await loadMissingOnCheck(currentTree, id, isChecked, isRoot);
        if (currentTree !== newTree) {
            setFullTree(newTree);
            setTreeWithData(treeWithData.mergeItems(newTree));
        }
        return newTree;
    }, [loadMissingOnCheck, setFullTree, setTreeWithData, treeWithData]);

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
                currentTree = fullTree;
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
            loadMissing(currentTree, completeReset)
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
                        setTreeWithData(newTree);
                        const newFullTree = dataSourceState.search ? fullTree.mergeItems(newTree) : newTree;
                        setFullTree(newFullTree);
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

    const treeRowsStats = useMemo(() => {
        const rootInfo = treeWithData.getNodeInfo(undefined);
        const rootCount = rootInfo.count;
        let completeFlatListRowsCount = undefined;
        if (!getChildCount && rootCount != null) {
            completeFlatListRowsCount = rootCount;
        }

        return {
            completeFlatListRowsCount,
            totalCount: rootInfo.totalCount ?? treeWithData.getTotalRecursiveCount() ?? 0,
        };
    }, [getChildCount, treeWithData]);

    const reload = useCallback(() => {
        setIsForceReload(true);
    }, [props, setTreeWithData]);

    return {
        tree: treeWithData,
        dataSourceState,
        setDataSourceState,
        isFoldedByDefault,
        getId,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        getChildCount,
        reload,
        flattenSearchResults,
        isFetching,
        isLoading,
        loadMissingRecords,
        ...treeRowsStats,
    };
}
