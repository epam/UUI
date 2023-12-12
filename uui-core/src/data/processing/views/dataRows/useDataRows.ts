import { useCallback, useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD } from '../tree';
import { CascadeSelection, DataRowOptions, DataRowProps, DataSourceListProps, DataSourceState, VirtualListRange } from '../../../../types';
import { FoldingService, CheckingService, FocusService, SelectingService } from '../tree/hooks/services';
import { useDataRowProps } from './useDataRowProps';
import { useBuildRows } from './useBuildRows';
import { useSelectAll } from './useSelectAll';
import { usePinnedRows } from './usePinnedRows';

export interface UseDataRowsProps<TItem, TId, TFilter = any> extends FoldingService<TItem, TId>, CheckingService<TItem, TId>, FocusService, SelectingService<TItem, TId> {
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    flattenSearchResults?: boolean;
    isPartialLoad?: boolean;
    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    getChildCount?(item: TItem): number;
    getId: (item: TItem) => TId;
    cascadeSelection?: CascadeSelection;

    selectAll?: boolean;

    getEstimatedChildrenCount: (id: TId) => number;
    getMissingRecordsCount: (id: TId, totalRowsCount: number, loadedChildrenCount: number) => number;
    lastRowIndex: number;
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

        getEstimatedChildrenCount,
        getMissingRecordsCount,
        cascadeSelection,
        lastRowIndex,

        isFolded,
        isRowChecked,
        isRowChildrenChecked,

        handleOnFold,
        handleSelectAll,
        handleOnCheck,
        handleOnFocus,
        handleOnSelect,
    } = props;

    const isFlattenSearch = useMemo(() => dataSourceState.search && flattenSearchResults, []);

    const { getRowProps, getUnknownRowProps, getLoadingRowProps } = useDataRowProps<TItem, TId, TFilter>({
        tree,
        getId,
        dataSourceState,
        getRowOptions,
        rowOptions,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
        isRowChecked,
        isRowChildrenChecked,
        isFlattenSearch,
        getEstimatedChildrenCount,
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
        isFolded,
        handleOnFold,
        getRowProps,
        getLoadingRowProps,
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
        handleSelectAll,
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
        return {
            rowsCount: rows.length,
            knownRowsCount: rows.length,
            exactRowsCount: rows.length,
            totalCount: tree?.getTotalRecursiveCount() ?? 0, // TODO: totalCount should be taken from fullTree (?).
            selectAll,
        };
    }, [rows.length, tree, selectAll]);

    const getVisibleRows = () => {
        const visibleRows = rows.slice(dataSourceState.topIndex, lastRowIndex);
        return withPinnedRows(visibleRows);
    };

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
