import { useCallback, useMemo } from 'react';
import { DataRowProps, DataSourceListProps, VirtualListRange } from '../../../../types';
import { useCheckingService, useFoldingService, useFocusService, useSelectingService } from './services';
import { useDataRowProps } from './useDataRowProps';
import { useBuildRows } from './useBuildRows';
import { useSelectAll } from './useSelectAll';
import { usePinnedRows } from './usePinnedRows';
import { useUpdateRowOptions } from './useUpdateRowProps';
import { CommonDataSourceConfig, TreeLoadingState } from '../tree/hooks/strategies/types/common';
import { NOT_FOUND_RECORD, ITree } from '../tree';
import { FULLY_LOADED, LOADING_RECORD, isFound } from '../tree/newTree';
import { CascadeSelectionService } from './services/useCascadeSelectionService';

export interface UseDataRowsProps<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    Partial<CascadeSelectionService<TId>> {

    tree: ITree<TItem, TId>;
}

export function useDataRows<TItem, TId, TFilter = any>(
    props: UseDataRowsProps<TItem, TId, TFilter>,
) {
    const {
        tree,
        getId,
        getParentId,
        getChildCount,
        dataSourceState,

        flattenSearchResults,
        getRowOptions,
        rowOptions,

        cascadeSelection,
        isLoading,
        isFetching,
        setDataSourceState,
        isFoldedByDefault,
        handleCascadeSelection,
    } = props;

    const maxVisibleRowIndex = useMemo(
        () => dataSourceState.topIndex + dataSourceState.visibleCount,
        [tree, dataSourceState.topIndex, dataSourceState.visibleCount],
    );
    const isFlattenSearch = useMemo(
        () => dataSourceState.search && flattenSearchResults,
        [dataSourceState.search, flattenSearchResults],
    );

    const getEstimatedChildrenCount = useCallback((id: TId) => {
        if (id === undefined) {
            const { count, status } = tree.getItems(id);
            return count !== undefined && status === FULLY_LOADED ? count : undefined;
        }

        const item = tree.getById(id);
        if (!isFound(item)) return undefined;

        const childCount = props.getChildCount?.(item) ?? undefined;
        if (childCount === undefined) return undefined;

        const { count, status } = tree.getItems(id);
        if (count !== undefined && status === FULLY_LOADED) {
            // nodes are already loaded, and we know the actual count
            return count;
        }

        return childCount;
    }, [props.getChildCount, tree]);

    const getMissingRecordsCount = useCallback((id: TId, totalRowsCount: number, loadedChildrenCount: number) => {
        const { count } = tree.getItems(id);

        // Estimate how many more nodes there are at current level, to put 'loading' placeholders.
        if (count !== undefined) {
            // Exact count known
            return count - loadedChildrenCount;
        }

        const estimatedChildCount = getEstimatedChildrenCount(id);
        // estimatedChildCount = undefined for top-level rows only.
        if (id === undefined && totalRowsCount < maxVisibleRowIndex) {
            return maxVisibleRowIndex - totalRowsCount; // let's put placeholders down to the bottom of visible list
        }

        if (estimatedChildCount > loadedChildrenCount) {
            // According to getChildCount (put into estimatedChildCount), there are more rows on this level
            return estimatedChildCount - loadedChildrenCount;
        }

        // We have a bad estimate - it even less that actual items we have
        // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
        // let's guess we have at least 1 item more than loaded
        return 1;
    }, [maxVisibleRowIndex, tree, getEstimatedChildrenCount]);

    const { handleOnCheck, isRowChecked, isRowChildrenChecked, isItemCheckable, handleSelectAll } = useCheckingService({
        tree,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getParentId,
        rowOptions,
        getRowOptions,
        handleCascadeSelection,
    });

    const foldingService = useFoldingService({
        dataSourceState, setDataSourceState, isFoldedByDefault, getId,
    });

    const focusService = useFocusService({ setDataSourceState });

    const selectingService = useSelectingService({ setDataSourceState });

    const { getRowProps, getUnknownRowProps, getLoadingRowProps, updateRowOptions } = useDataRowProps<TItem, TId, TFilter>({
        tree,
        getId,

        isFlattenSearch,
        dataSourceState,

        rowOptions,
        getRowOptions,

        getEstimatedChildrenCount,

        handleOnCheck,
        isRowChecked,
        isRowChildrenChecked,
        isItemCheckable,
        ...selectingService,
        ...focusService,
    });

    const { rows: allRows, pinned, pinnedByParentId, stats } = useBuildRows({
        tree,
        dataSourceState,
        cascadeSelection,
        isFlattenSearch,
        maxVisibleRowIndex,
        getEstimatedChildrenCount,
        getMissingRecordsCount,
        getRowProps,
        getLoadingRowProps,
        isLoading,
        ...foldingService,
    });

    const updatedRows = useUpdateRowOptions({ rows: allRows, updateRowOptions });

    const withPinnedRows = usePinnedRows({
        rows: updatedRows,
        pinned,
        pinnedByParentId,
    });

    const selectAll = useSelectAll({
        tree,
        checked: dataSourceState.checked,
        stats,
        areCheckboxesVisible: rowOptions?.checkbox?.isVisible,
        handleSelectAll,
    });

    const getById = (id: TId, index: number) => {
        const item = tree.getById(id);
        console.log('here');
        if (item === NOT_FOUND_RECORD) {
            return getUnknownRowProps(id, index, []);
        }

        if (item === LOADING_RECORD) {
            return getLoadingRowProps(id, index, []);
        }

        return getRowProps(item, index);
    };

    const listProps = useMemo((): DataSourceListProps => {
        const { count } = tree.getItems(undefined);

        const completeFlatListRowsCount = !getChildCount && count != null ? count : undefined;
        let rowsCount;
        if (completeFlatListRowsCount !== undefined) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = completeFlatListRowsCount;
        } else if (!stats.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = updatedRows.length;
        } else {
            // We definitely have more rows to show below the last visible row.
            // We need to add at least 1 row below, so VirtualList or other component would not detect the end of the list, and query loading more rows later.
            // We have to balance this number.
            // To big - would make scrollbar size to shrink when we hit bottom
            // To small - and VirtualList will re-request rows until it will fill it's last block.
            // So, it should be at least greater than VirtualList block size (default is 20)
            // Probably, we'll move this const to props later if needed;
            const rowsToAddBelowLastKnown = 20;

            rowsCount = Math.max(updatedRows.length, maxVisibleRowIndex + rowsToAddBelowLastKnown);
        }

        return {
            rowsCount,
            knownRowsCount: updatedRows.length,
            exactRowsCount: updatedRows.length,
            selectAll,
            isReloading: isFetching,
        };
    }, [updatedRows.length, selectAll, stats.hasMoreRows, maxVisibleRowIndex, getChildCount, tree, isFetching]);

    const rows = useMemo(
        () => {
            const from = dataSourceState.topIndex;
            const count = dataSourceState.visibleCount;
            const visibleRowsWithPins = withPinnedRows(updatedRows.slice(from, from + count));
            if (stats.hasMoreRows) {
                // We don't run rebuild rows on scrolling. We rather wait for the next load to happen.
                // So there can be a case when we haven't updated rows (to add more loading rows), and view is scrolled down
                // We need to add more loading rows in such case.
                const lastRow = updatedRows[updatedRows.length - 1];

                while (visibleRowsWithPins.length < count && from + visibleRowsWithPins.length < listProps.rowsCount) {
                    const index = from + visibleRowsWithPins.length;
                    const row = getLoadingRowProps('_loading_' + index, index);
                    row.indent = lastRow.indent;
                    row.path = lastRow.path;
                    row.depth = lastRow.depth;
                    visibleRowsWithPins.push(row);
                }
            }

            return visibleRowsWithPins;
        },
        [
            updatedRows,
            dataSourceState.topIndex,
            dataSourceState.visibleCount,
            withPinnedRows,
            listProps,
            getLoadingRowProps,
        ],
    );

    const getSelectedRows = ({ topIndex = 0, visibleCount }: VirtualListRange = {}) => {
        let checked: TId[] = [];
        if (dataSourceState.selectedId !== null && dataSourceState.selectedId !== undefined) {
            checked = [dataSourceState.selectedId];
        } else if (dataSourceState.checked) {
            checked = dataSourceState.checked;
        }

        if (visibleCount !== undefined) {
            checked = checked.slice(topIndex, topIndex + visibleCount);
        }
        const selectedRows: Array<DataRowProps<TItem, TId>> = [];
        const missingIds: TId[] = [];
        checked.forEach((id, n) => {
            const row = getById(id, topIndex + n);
            if (row.isUnknown) {
                missingIds.push(id);
            }
            selectedRows.push(row);
        });
        if (missingIds.length) {
            console.error(`DataSource can't find selected/checked items with following IDs: ${missingIds.join(', ')}.
                Read more here: https://github.com/epam/UUI/issues/89`);
        }

        return selectedRows;
    };

    const getSelectedRowsCount = () => {
        const count = dataSourceState.checked?.length ?? 0;
        if (!count) {
            return (dataSourceState.selectedId !== undefined && dataSourceState.selectedId !== null) ? 1 : 0;
        }

        return count;
    };

    const clearAllChecked = useCallback(() => handleSelectAll(false), [handleSelectAll]);

    return {
        listProps,
        rows,
        getSelectedRows,
        getSelectedRowsCount,
        getById,
        clearAllChecked,

        selectAll,
    };
}
