import { useCallback, useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD } from '../tree';
import { CascadeSelection, DataRowOptions, DataRowPathItem, DataRowProps, DataSourceListProps, DataSourceState, VirtualListRange } from '../../../../types';
import { idToKey } from '../helpers';
import { FoldingService, CheckingService, FocusService, SelectingService } from '../tree/hooks/services';
import { NodeStats, getDefaultNodeStats, getRowStats, mergeStats } from './stats';
import { useDataRowProps } from './useDataRowProps';

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

    const { getRowProps, getLoadingRowProps, getEmptyRowProps } = useDataRowProps<TItem, TId, TFilter>({
        tree,
        getId,
        dataSourceState,
        getRowOptions,
        rowOptions,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
        handleSelectAll,
        handleOnFold,
        isRowChecked,
        isRowChildrenChecked,
        isFlattenSearch,
        getEstimatedChildrenCount,
        isFolded,
    });

    const rebuildRows = () => {
        const rows: DataRowProps<TItem, TId>[] = [];
        const pinned: Record<string, number> = {};
        const pinnedByParentId: Record<string, number[]> = {};

        const iterateNode = (
            parentId: TId,
            appendRows: boolean, // Will be false, if we are iterating folded nodes.
        ): NodeStats => {
            let currentLevelRows = 0;
            let stats = getDefaultNodeStats();

            const layerRows: DataRowProps<TItem, TId>[] = [];
            const nodeInfo = tree.getNodeInfo(parentId);

            const ids = tree.getChildrenIdsByParentId(parentId);

            for (let n = 0; n < ids.length; n++) {
                const id = ids[n];
                const item = tree.getById(id);
                if (item === NOT_FOUND_RECORD) {
                    continue;
                }

                const row = getRowProps(item, rows.length);
                if (appendRows && (!isPartialLoad || (isPartialLoad && rows.length < lastRowIndex))) {
                    rows.push(row);
                    layerRows.push(row);
                    currentLevelRows++;
                }

                stats = getRowStats(row, stats, cascadeSelection);
                row.isLastChild = n === ids.length - 1 && nodeInfo.count === ids.length;
                row.indent = isFlattenSearch ? 0 : row.path.length + 1;
                const estimatedChildrenCount = getEstimatedChildrenCount(id);
                if (!isFlattenSearch && estimatedChildrenCount !== undefined) {
                    const childrenIds = tree.getChildrenIdsByParentId(id);

                    if (estimatedChildrenCount > 0) {
                        row.isFolded = isFolded(item);
                        row.onFold = row.isFoldable && handleOnFold;

                        if (childrenIds.length > 0) {
                        // some children are loaded
                            const childStats = iterateNode(id, appendRows && !row.isFolded);
                            row.isChildrenChecked = row.isChildrenChecked || childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats = mergeStats(stats, childStats);
                        // while searching and no children in visible tree, no need to append placeholders.
                        } else if (!dataSourceState.search && !row.isFolded && appendRows) {
                        // children are not loaded
                            const parentsWithRow = [...row.path, tree.getPathItem(item)];
                            for (let m = 0; m < estimatedChildrenCount && rows.length < lastRowIndex; m++) {
                                const loadingRow = getLoadingRowProps('_loading_' + rows.length, rows.length, parentsWithRow);
                                loadingRow.indent = parentsWithRow.length + 1;
                                loadingRow.isLastChild = m === estimatedChildrenCount - 1;
                                rows.push(loadingRow);
                                currentLevelRows++;
                            }
                        }
                    }
                }

                row.isPinned = row.pin?.(row) ?? false;
                if (row.isPinned) {
                    pinned[idToKey(row.id)] = row.index;
                    if (!pinnedByParentId[idToKey(row.parentId)]) {
                        pinnedByParentId[idToKey(row.parentId)] = [];
                    }
                    pinnedByParentId[idToKey(row.parentId)]?.push(row.index);
                }
            }

            const pathToParent = tree.getPathById(parentId);
            const parent = tree.getById(parentId);
            const parentPathItem = parent !== NOT_FOUND_RECORD ? [tree.getPathItem(parent)] : [];
            const path = parentId ? [...pathToParent, ...parentPathItem] : pathToParent;
            if (appendRows) {
                let missingCount = getMissingRecordsCount(parentId, rows.length, currentLevelRows);
                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }

                // Append loading rows, stop at lastRowIndex (last row visible)
                while (rows.length < lastRowIndex && missingCount > 0) {
                    const row = getLoadingRowProps('_loading_' + rows.length, rows.length, path);
                    rows.push(row);
                    layerRows.push(row);
                    currentLevelRows++;
                    missingCount--;
                }
            }

            const isListFlat = path.length === 0 && !layerRows.some((r) => r.isFoldable);
            if (isListFlat || isFlattenSearch) {
                layerRows.forEach((r) => {
                    r.indent = 0;
                });
            }

            return stats;
        };

        const rootStats = iterateNode(undefined, true);

        return {
            rows,
            pinned,
            pinnedByParentId,
            stats: rootStats,
        };
    };

    const { rows, pinned, pinnedByParentId, stats } = useMemo(() => rebuildRows(), []);

    const isSelectAllEnabled = useMemo(() => props.selectAll === undefined ? true : props.selectAll, [props.selectAll]);

    const selectAll = useMemo(() => {
        if (stats.isSomeCheckable && isSelectAllEnabled) {
            return {
                value: stats.isSomeCheckboxEnabled ? stats.isAllChecked : false,
                onValueChange: handleSelectAll,
                indeterminate: dataSourceState.checked && dataSourceState.checked.length > 0 && !stats.isAllChecked,
            };
        } else if (tree.getRootIds().length === 0 && rowOptions?.checkbox?.isVisible && isSelectAllEnabled) {
            // Nothing loaded yet, but we guess that something is checkable. Add disabled checkbox for less flicker.
            return {
                value: false,
                onValueChange: () => {},
                isDisabled: true,
                indeterminate: dataSourceState.checked?.length > 0,
            };
        }
        return null;
    }, [tree, rowOptions, dataSourceState.checked, stats, isSelectAllEnabled, handleSelectAll]);

    const getListProps = useCallback((): DataSourceListProps => {
        return {
            rowsCount: rows.length,
            knownRowsCount: rows.length,
            exactRowsCount: rows.length,
            totalCount: tree?.getTotalRecursiveCount() ?? 0, // TODO: totalCount should be taken from fullTree (?).
            selectAll,
        };
    }, [rows.length, tree, selectAll]);

    const getLastPinnedBeforeRow = (row: DataRowProps<TItem, TId>, pinnedIndexes: number[]) => {
        const isBeforeOrEqualToRow = (pinnedRowIndex: number) => {
            const pinnedRow = rows[pinnedRowIndex];
            if (!pinnedRow) {
                return false;
            }
            return row.index >= pinnedRow.index;
        };

        let foundRowIndex = -1;
        for (const pinnedRowIndex of pinnedIndexes) {
            if (isBeforeOrEqualToRow(pinnedRowIndex)) {
                foundRowIndex = pinnedRowIndex;
            } else if (foundRowIndex !== -1) {
                break;
            }
        }

        if (foundRowIndex === -1) {
            return undefined;
        }
        return foundRowIndex;
    };

    const getLastHiddenPinnedByParent = (row: DataRowProps<TItem, TId>, alreadyAdded: TId[]) => {
        const pinnedIndexes = pinnedByParentId[idToKey(row.parentId)];
        if (!pinnedIndexes || !pinnedIndexes.length) {
            return undefined;
        }

        const lastPinnedBeforeRow = getLastPinnedBeforeRow(row, pinnedIndexes);
        if (lastPinnedBeforeRow === undefined) {
            return undefined;
        }

        const lastHiddenPinned = rows[lastPinnedBeforeRow];
        if (!lastHiddenPinned || alreadyAdded.includes(lastHiddenPinned.id)) {
            return undefined;
        }

        return lastHiddenPinned;
    };

    const getRowsWithPinned = (allRows: DataRowProps<TItem, TId>[]) => {
        if (!allRows.length) return [];

        const rowsWithPinned: DataRowProps<TItem, TId>[] = [];
        const alreadyAdded = allRows.map(({ id }) => id);
        const [firstRow] = allRows;
        firstRow.path.forEach((item) => {
            const pinnedIndex = pinned[idToKey(item.id)];
            if (pinnedIndex === undefined) return;

            const parent = rows[pinnedIndex];
            if (!parent || alreadyAdded.includes(parent.id)) return;

            rowsWithPinned.push(parent);
            alreadyAdded.push(parent.id);
        });

        const lastHiddenPinned = getLastHiddenPinnedByParent(firstRow, alreadyAdded);
        if (lastHiddenPinned) {
            rowsWithPinned.push(lastHiddenPinned);
        }

        return rowsWithPinned.concat(allRows);
    };

    const getVisibleRows = () => {
        const visibleRows = rows.slice(dataSourceState.topIndex, lastRowIndex);
        return getRowsWithPinned(visibleRows);
    };

    const getUnknownRow = (id: any, index: number = 0, path: DataRowPathItem<TId, TItem>[] = null): DataRowProps<TItem, TId> => {
        const emptyRowProps = getEmptyRowProps(id, index, path);
        const checkbox = (rowOptions?.checkbox?.isVisible || emptyRowProps.isChecked)
            ? { isVisible: true, isDisabled: false }
            : undefined;

        return {
            ...emptyRowProps,
            checkbox,
            isUnknown: true,
        };
    };

    const getById = (id: TId, index: number) => {
        // if originalTree is not created, but blank tree is defined, get item from it
        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            return getUnknownRow(id, index, []);
        }

        return getRowProps(item, index);
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
