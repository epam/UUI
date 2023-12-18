import { useCallback, useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD } from '../tree';
import { CascadeSelection, DataRowOptions, DataRowProps, DataSourceListProps, DataSourceState, VirtualListRange } from '../../../../types';
import { SelectingService, FoldingService, FocusService, CheckingService } from '../tree/hooks/services';
import { useDataRowProps } from './useDataRowProps';
import { useBuildRows } from './useBuildRows';
import { useSelectAll } from './useSelectAll';
import { usePinnedRows } from './usePinnedRows';
import { useUpdateRowOptions } from './useUpdateRowProps';

export interface UseDataRowsProps<TItem, TId, TFilter = any> extends CheckingService<TItem, TId>, SelectingService<TItem, TId>, FoldingService<TItem, TId>, FocusService {
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    flattenSearchResults?: boolean;
    isPartialLoad?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    getChildCount?(item: TItem): number;

    getId: (item: TItem) => TId;
    getParentId?(item: TItem): TId | undefined;

    cascadeSelection?: CascadeSelection;

    selectAll?: boolean;
    // TODO: add solid type
    getTreeRowsStats: () => {
        completeFlatListRowsCount: any;
        totalCount: number;
    }

    isFetching?: boolean;
    isLoading?: boolean;
}

export function useDataRows<TItem, TId, TFilter = any>(
    props: UseDataRowsProps<TItem, TId, TFilter>,
) {
    const {
        tree,
        getId,
        dataSourceState,

        flattenSearchResults,
        isPartialLoad,
        getRowOptions,
        rowOptions,

        cascadeSelection,
        getTreeRowsStats,
        isLoading,
        isFetching,
    } = props;

    const lastRowIndex = useMemo(
        () => {
            const actualCount = tree.getTotalRecursiveCount();
            const currentLastIndex = dataSourceState.topIndex + dataSourceState.visibleCount;
            if (actualCount != null && actualCount < currentLastIndex) return actualCount;
            return currentLastIndex;
        },
        [tree, dataSourceState.topIndex, dataSourceState.visibleCount],
    );
    const isFlattenSearch = useMemo(
        () => dataSourceState.search && flattenSearchResults,
        [dataSourceState.search, flattenSearchResults],
    );

    const getEstimatedChildrenCount = useCallback((id: TId) => {
        if (id === undefined) return undefined;

        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) return undefined;

        const childCount = props.getChildCount?.(item) ?? undefined;
        if (childCount === undefined) return undefined;

        const nodeInfo = tree.getNodeInfo(id);
        if (nodeInfo?.count !== undefined) {
            // nodes are already loaded, and we know the actual count
            return nodeInfo.count;
        }

        return childCount;
    }, [props.getChildCount, tree]);

    const getMissingRecordsCount = useCallback((id: TId, totalRowsCount: number, loadedChildrenCount: number) => {
        const nodeInfo = tree.getNodeInfo(id);

        const estimatedChildCount = getEstimatedChildrenCount(id);

        // Estimate how many more nodes there are at current level, to put 'loading' placeholders.
        if (nodeInfo.count !== undefined) {
            // Exact count known
            return nodeInfo.count - loadedChildrenCount;
        }

        // estimatedChildCount = undefined for top-level rows only.
        if (id === undefined && totalRowsCount < lastRowIndex) {
            return lastRowIndex - totalRowsCount; // let's put placeholders down to the bottom of visible list
        }

        if (estimatedChildCount > loadedChildrenCount) {
            // According to getChildCount (put into estimatedChildCount), there are more rows on this level
            return estimatedChildCount - loadedChildrenCount;
        }

        // We have a bad estimate - it even less that actual items we have
        // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
        // let's guess we have at least 1 item more than loaded
        return 1;
    }, [lastRowIndex, tree, getEstimatedChildrenCount]);

    const { getRowProps, getUnknownRowProps, getLoadingRowProps, updateRowOptions } = useDataRowProps<TItem, TId, TFilter>({
        tree,
        getId,

        isFlattenSearch,
        dataSourceState,

        rowOptions,
        getRowOptions,

        getEstimatedChildrenCount,

        handleOnCheck: props.handleOnCheck,
        handleOnSelect: props.handleOnSelect,
        handleOnFocus: props.handleOnFocus,
        isRowChecked: props.isRowChecked,
        isRowChildrenChecked: props.isRowChildrenChecked,
        isItemCheckable: props.isItemCheckable,
    });

    const { rows, pinned, pinnedByParentId, stats } = useBuildRows({
        tree,
        dataSourceState,
        cascadeSelection,
        isPartialLoad,
        isFlattenSearch,
        lastRowIndex,
        getEstimatedChildrenCount,
        getMissingRecordsCount,
        getRowProps,
        getLoadingRowProps,
        isFolded: props.isFolded,
        handleOnFold: props.handleOnFold,
        isLoading,
    });

    const updatedRows = useUpdateRowOptions({ rows, updateRowOptions, getRowOptions });

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
        handleSelectAll: props.handleSelectAll,
    });

    const getById = (id: TId, index: number) => {
        // if originalTree is not created, but blank tree is defined, get item from it
        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            return getUnknownRowProps(id, index, []);
        }

        return getRowProps(item, index);
    };

    const listProps = useMemo((): DataSourceListProps => {
        const { completeFlatListRowsCount, totalCount } = getTreeRowsStats();

        let rowsCount;
        if (completeFlatListRowsCount !== undefined) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = completeFlatListRowsCount;
        } else if (!stats.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = rows.length;
        } else {
            // We definitely have more rows to show below the last visible row.
            // We need to add at least 1 row below, so VirtualList or other component would not detect the end of the list, and query loading more rows later.
            // We have to balance this number.
            // To big - would make scrollbar size to shrink when we hit bottom
            // To small - and VirtualList will re-request rows until it will fill it's last block.
            // So, it should be at least greater than VirtualList block size (default is 20)
            // Probably, we'll move this const to props later if needed;
            const rowsToAddBelowLastKnown = 20;

            rowsCount = Math.max(rows.length, lastRowIndex + rowsToAddBelowLastKnown);
        }

        return {
            rowsCount,
            knownRowsCount: rows.length,
            exactRowsCount: rows.length,
            totalCount,
            selectAll,
            isReloading: isFetching,
        };
    }, [rows.length, selectAll, getTreeRowsStats, stats.hasMoreRows, lastRowIndex, isFetching]);

    const visibleRows = useMemo(
        () => {
            const from = dataSourceState.topIndex;
            const count = dataSourceState.visibleCount;
            const visibleRowsWithPins = withPinnedRows(rows.slice(from, from + count));
            if (stats.hasMoreRows) {
                // We don't run rebuild rows on scrolling. We rather wait for the next load to happen.
                // So there can be a case when we haven't updated rows (to add more loading rows), and view is scrolled down
                // We need to add more loading rows in such case.
                const lastRow = rows[rows.length - 1];

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
            rows,
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

    return {
        listProps,
        visibleRows,
        getSelectedRows,
        getSelectedRowsCount,

        selectAll,
    };
}
