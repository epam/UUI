import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrevious } from '../../../../../../../hooks';
import { DataSourceState, LazyDataSourceApi } from '../../../../../../../types';
import { ITree } from '../../../../tree';
import isEqual from 'lodash.isequal';

export interface UseLoadDataProps<TItem, TId, TFilter = any> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    tree: ITree<TItem, TId>;
    filter?: TFilter;
    dataSourceState: DataSourceState<TFilter, TId>;
    backgroundReload?: boolean;
    isFolded: (item: TItem) => boolean;
}

interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: ITree<TItem, TId>;
}

const searchWasChanged = <TFilter, TId>(
    prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => newValue?.search !== prevValue?.search;

const sortingWasChanged = <TFilter, TId>(
    prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => !isEqual(newValue?.sorting, prevValue?.sorting);

const filterWasChanged = <TFilter, TId>(
    prevValue: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>,
) => !isEqual(newValue?.filter, prevValue?.filter);

const shouldRebuildTree = <TFilter, TId>(prevValue: DataSourceState<TFilter, TId>, newValue: DataSourceState<TFilter, TId>) =>
    searchWasChanged(prevValue, newValue)
    || sortingWasChanged(prevValue, newValue)
    || filterWasChanged(prevValue, newValue)
    || newValue?.page !== prevValue?.page
    || newValue?.pageSize !== prevValue?.pageSize;

const onlySearchWasUnset = <TFilter, TId>(prevValue: DataSourceState<TFilter, TId>, newValue: DataSourceState<TFilter, TId>) =>
    searchWasChanged(prevValue, newValue) && !newValue.search
    && !(
        sortingWasChanged(prevValue, newValue)
        || filterWasChanged(prevValue, newValue)
        || newValue?.page !== prevValue?.page
        || newValue?.pageSize !== prevValue?.pageSize);

export function useLoadData<TItem, TId, TFilter = any>(
    props: UseLoadDataProps<TItem, TId, TFilter>,
) {
    const { api, tree, filter, dataSourceState, backgroundReload, isFolded } = props;
    const [treeWithData, setTreeWithData] = useState(tree);
    const prevFilter = usePrevious(filter);
    const prevDataSourceState = usePrevious(dataSourceState);

    const isReloadingRef = useRef(false);
    const promiseInProgressRef = useRef<Promise<LoadResult<TItem, TId>>>();
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

    const loadMissing = (abortInProgress: boolean, sourceTree: ITree<TItem, TId>): Promise<LoadResult<TItem, TId>> => {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed
        if (promiseInProgressRef.current === null || abortInProgress) {
            promiseInProgressRef.current = Promise.resolve({ isUpdated: false, isOutdated: false, tree: sourceTree });
        }

        promiseInProgressRef.current = promiseInProgressRef.current.then(() =>
            loadMissingImpl(sourceTree));

        return promiseInProgressRef.current;
    };

    const loadMissingImpl = async (sourceTree: ITree<TItem, TId>): Promise<LoadResult<TItem, TId>> => {
        const loadingTree = sourceTree;

        try {
            const newTreePromise = sourceTree.load(
                {
                    ...props,
                    isFolded,
                    api,
                    filter: { ...{}, ...filter },
                },
                dataSourceState,
            );

            const newTree = await newTreePromise;

            const linkToTree = treeWithData;

            // If tree is changed during this load, than there was reset occurred (new value arrived)
            // We need to tell caller to reject this result
            const isOutdated = linkToTree !== loadingTree;
            const isUpdated = linkToTree !== newTree;
            return { isUpdated, isOutdated, tree: newTree };
        } catch (e) {
            // TBD - correct error handling
            console.error('LazyListView: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    };

    useEffect(() => {
        let completeReset = false;
        const shouldReloadData = !isEqual(prevFilter, filter)
            || shouldRebuildTree(prevDataSourceState, dataSourceState);

        let currentTree = treeWithData;
        if (prevDataSourceState == null || shouldReloadData) {
            isReloadingRef.current = true;
            if (!onlySearchWasUnset(prevDataSourceState, dataSourceState)) {
                currentTree = treeWithData.clearStructure();
            }
            completeReset = true;
        }
        const isFoldingChanged = !prevDataSourceState || dataSourceState.folded !== prevDataSourceState.folded;
        const shouldShowPlacehodlers = !shouldReloadData
            || (shouldReloadData && !backgroundReload);

        if ((completeReset && shouldShowPlacehodlers) || isFoldingChanged) {
            fingerprintRef.current = new Date().toISOString();
        }

        const moreRowsNeeded = areMoreRowsNeeded(prevDataSourceState, dataSourceState);
        if (completeReset || isFoldingChanged || moreRowsNeeded) {
            loadMissing(completeReset, currentTree)
                .then(({ isUpdated, isOutdated, tree: newTree }) => {
                    if (isUpdated && !isOutdated) {
                        setTreeWithData(newTree);
                        isReloadingRef.current = false;
                        fingerprintRef.current = new Date().toISOString();
                    }
                }).finally(() => {
                    isReloadingRef.current = false;
                });
        }
    }, [prevDataSourceState, dataSourceState, prevFilter, filter, treeWithData, setTreeWithData, areMoreRowsNeeded]);

    return {
        tree: treeWithData,
        fingerprint: fingerprintRef.current,
    };
}
