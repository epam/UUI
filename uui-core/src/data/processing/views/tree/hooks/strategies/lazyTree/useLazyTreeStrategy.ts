import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Tree } from '../../../Tree';
import { LazyTreeStrategyProps } from './types';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState } from '../../../../../../../types';

import isEqual from 'lodash.isequal';
import { generateFingerprint, onlySearchWasUnset, shouldRebuildTree } from './helpers';
import { useFocusService, useFoldingService, useSelectingService } from '../../services';
import { useLoadData } from './useLoadData';
import { useLazyCheckingService } from './useLazyCheckingService';

export function useLazyTreeStrategy<TItem, TId, TFilter = any>(
    { flattenSearchResults = true, ...restProps }: LazyTreeStrategyProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const props = { flattenSearchResults, ...restProps };
    const {
        api, filter, dataSourceState, backgroundReload,
        isFoldedByDefault, getId, setDataSourceState,
        cascadeSelection, getRowOptions, rowOptions,
        getChildCount,
    } = props;

    const tree = useMemo(() => Tree.blank(props), [deps]);
    const [treeWithData, setTreeWithData] = useState(tree);
    const [fullTree, setFullTree] = useState(treeWithData);

    const prevFilter = usePrevious(filter);
    const prevDataSourceState = usePrevious(dataSourceState);
    const isReloadingRef = useRef(false);
    const fingerprintRef = useRef<string>();

    const actualRowsCount = useMemo(() => treeWithData.getTotalRecursiveCount() ?? 0, [treeWithData]);

    const lastRecordIndex = useMemo(
        () => dataSourceState.topIndex + dataSourceState.visibleCount,
        [dataSourceState.topIndex, dataSourceState.visibleCount],
    );

    const areMoreRowsNeeded = useCallback((prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex
            || prevValue?.visibleCount !== newValue?.visibleCount;

        return isFetchPositionAndAmountChanged && lastRecordIndex > actualRowsCount;
    }, [lastRecordIndex, actualRowsCount]);

    const foldingService = useFoldingService({ dataSourceState, isFoldedByDefault, getId, setDataSourceState });

    const { loadMissing } = useLoadData({ api, filter, dataSourceState, isFolded: foldingService.isFolded });

    useEffect(() => {
        let completeReset = false;
        const shouldReloadData = !isEqual(prevFilter, filter)
            || shouldRebuildTree(prevDataSourceState, dataSourceState);

        let currentTree = treeWithData;
        if (prevDataSourceState == null || shouldReloadData) {
            isReloadingRef.current = true;
            currentTree = treeWithData.clearStructure();
            if (onlySearchWasUnset(prevDataSourceState, dataSourceState)) {
                currentTree = fullTree;
            }
            completeReset = true;
        }
        const isFoldingChanged = !prevDataSourceState || dataSourceState.folded !== prevDataSourceState.folded;
        const shouldShowPlacehodlers = !shouldReloadData
            || (shouldReloadData && !backgroundReload);

        if ((completeReset && shouldShowPlacehodlers) || isFoldingChanged) {
            fingerprintRef.current = generateFingerprint();
        }

        const moreRowsNeeded = areMoreRowsNeeded(prevDataSourceState, dataSourceState);
        if (completeReset || isFoldingChanged || moreRowsNeeded) {
            loadMissing(currentTree, completeReset)
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
                        setTreeWithData(newTree);
                        const newFullTree = dataSourceState.search ? fullTree.mergeItems(newTree) : newTree;
                        setFullTree(newFullTree);

                        isReloadingRef.current = false;
                        fingerprintRef.current = generateFingerprint();
                    }
                }).finally(() => {
                    isReloadingRef.current = false;
                });
        }
    }, [
        prevDataSourceState,
        dataSourceState,
        prevFilter,
        filter,
        treeWithData,
        setTreeWithData,
        areMoreRowsNeeded,
    ]);

    const checkingService = useLazyCheckingService({
        tree: fullTree,
        onTreeUpdate: (newTree) => {
            setFullTree(newTree);
            setTreeWithData(treeWithData.mergeItems(newTree));
        },
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        loadMissingRecords: loadMissing,
    });

    const focusService = useFocusService({ setDataSourceState });
    const selectingService = useSelectingService({ setDataSourceState });

    const getTreeRowsStats = useCallback(() => {
        const rootInfo = tree.getNodeInfo(undefined);
        const rootCount = rootInfo.count;
        let completeFlatListRowsCount = undefined;
        if (!getChildCount && rootCount != null) {
            completeFlatListRowsCount = rootCount;
        }

        return {
            completeFlatListRowsCount,
            totalCount: rootInfo.totalCount ?? tree.getTotalRecursiveCount() ?? 0,
        };
    }, [getChildCount, tree]);

    return {
        tree: treeWithData,
        fingerprint: fingerprintRef.current,
        ...checkingService,
        ...foldingService,
        ...focusService,
        ...selectingService,
        getTreeRowsStats,
    };
}
