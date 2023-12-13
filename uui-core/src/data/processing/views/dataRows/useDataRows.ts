import { useCallback, useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD } from '../tree';
import { CascadeSelection, DataRowOptions, DataRowProps, DataSourceListProps, DataSourceState, VirtualListRange } from '../../../../types';
import { useCheckingService, useFoldingService, useFocusService, useSelectingService } from './services';
import { useDataRowProps } from './useDataRowProps';
import { useBuildRows } from './useBuildRows';
import { useSelectAll } from './useSelectAll';
import { usePinnedRows } from './usePinnedRows';

export interface UseDataRowsProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    flattenSearchResults?: boolean;
    isPartialLoad?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem): boolean;

    getChildCount?(item: TItem): number;

    getId: (item: TItem) => TId;
    getParentId?(item: TItem): TId | undefined;

    cascadeSelection?: CascadeSelection;

    getEstimatedChildrenCount: (id: TId) => number;
    getMissingRecordsCount: (id: TId, totalRowsCount: number, loadedChildrenCount: number) => number;
    lastRowIndex: number;

    selectAll?: boolean;
    // TODO: add solid type
    getTreeRowsStats: () => {
        completeFlatListRowsCount: any;
        totalCount: number;
    }
}

export function useDataRows<TItem, TId, TFilter = any>(
    props: UseDataRowsProps<TItem, TId, TFilter>,
) {
    const {
        tree,
        getId,
        getParentId,
        dataSourceState,
        setDataSourceState,

        flattenSearchResults,
        isPartialLoad,
        getRowOptions,
        rowOptions,

        getEstimatedChildrenCount,
        getMissingRecordsCount,
        cascadeSelection,
        isFoldedByDefault,
        lastRowIndex,
        getTreeRowsStats,
    } = props;

    const checkingService = useCheckingService({
        tree,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getParentId,
    });

    const foldingService = useFoldingService({
        dataSourceState, setDataSourceState, isFoldedByDefault, getId,
    });

    const focusService = useFocusService({ setDataSourceState });

    const selectingService = useSelectingService({ setDataSourceState });

    const isFlattenSearch = useMemo(() => dataSourceState.search && flattenSearchResults, []);

    const { getRowProps, getUnknownRowProps, getLoadingRowProps } = useDataRowProps<TItem, TId, TFilter>({
        tree,
        getId,

        isFlattenSearch,
        dataSourceState,

        rowOptions,
        getRowOptions,

        getEstimatedChildrenCount,

        handleOnCheck: checkingService.handleOnCheck,
        handleOnSelect: selectingService.handleOnSelect,
        handleOnFocus: focusService.handleOnFocus,
        isRowChecked: checkingService.isRowChecked,
        isRowChildrenChecked: checkingService.isRowChildrenChecked,
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
        ...foldingService,
    });

    const withPinnedRows = usePinnedRows({
        rows,
        pinned,
        pinnedByParentId,
    });

    const selectAll = useSelectAll({
        tree,
        checked: dataSourceState.checked,
        stats,
        areCheckboxesVisible: rowOptions?.checkbox?.isVisible,
        handleSelectAll: checkingService.handleSelectAll,
    });

    const getById = (id: TId, index: number) => {
        // if originalTree is not created, but blank tree is defined, get item from it
        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            return getUnknownRowProps(id, index, []);
        }

        return getRowProps(item, index);
    };

    const getListProps = useCallback((): DataSourceListProps => {
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
            isReloading: false,
        };
    }, [rows.length, selectAll, getTreeRowsStats, stats.hasMoreRows, lastRowIndex]);

    const getVisibleRows = useCallback(
        () => {
            const from = dataSourceState.topIndex;
            const count = dataSourceState.visibleCount;
            const visibleRows = withPinnedRows(rows.slice(from, from + count));

            if (stats.hasMoreRows) {
                const listProps = getListProps();
                // We don't run rebuild rows on scrolling. We rather wait for the next load to happen.
                // So there can be a case when we haven't updated rows (to add more loading rows), and view is scrolled down
                // We need to add more loading rows in such case.
                const lastRow = rows[rows.length - 1];

                while (visibleRows.length < count && from + visibleRows.length < listProps.rowsCount) {
                    const index = from + visibleRows.length;
                    const row = getLoadingRowProps('_loading_' + index, index);
                    row.indent = lastRow.indent;
                    row.path = lastRow.path;
                    row.depth = lastRow.depth;
                    visibleRows.push(row);
                }
            }

            return visibleRows;
        },
        [
            rows,
            dataSourceState.topIndex,
            dataSourceState.visibleCount,
            withPinnedRows,
            getListProps,
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
        getListProps,
        getVisibleRows,
        getSelectedRows,
        getSelectedRowsCount,

        selectAll,
    };
}
