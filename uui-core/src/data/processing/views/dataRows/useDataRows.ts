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
    setDataSourceState: (dataSourceState: DataSourceState<TFilter, TId>) => void;

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

    const focusService = useFocusService({
        dataSourceState, setDataSourceState,
    });

    const selectingService = useSelectingService({
        dataSourceState, setDataSourceState,
    });

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
