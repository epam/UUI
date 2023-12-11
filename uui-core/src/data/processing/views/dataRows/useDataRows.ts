import { useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD } from '../tree';
import { DataRowProps } from '../../../../types';

interface NodeStats {
    isSomeCheckable: boolean;
    isSomeChecked: boolean;
    isAllChecked: boolean;
    isSomeSelected: boolean;
    hasMoreRows: boolean;
    isSomeCheckboxEnabled: boolean;
}

export interface UseDataRowsProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
}

export function useDataRows<TItem, TId, TFilter = any>(
    { tree }: UseDataRowsProps<TItem, TId, TFilter>,
    deps: any[],
) {
    const rebuildRows = () => {
        const rows: DataRowProps<TItem, TId>[] = [];
        const pinned: Record<string, number> = {};
        const pinnedByParentId: Record<string, number[]> = {};

        const lastIndex = this.getLastRecordIndex();

        const isFlattenSearch = this.isFlattenSearch?.() ?? false;
        const iterateNode = (
            parentId: TId,
            appendRows: boolean, // Will be false, if we are iterating folded nodes.
        ): NodeStats => {
            let currentLevelRows = 0;
            let stats = this.getDefaultNodeStats();

            const layerRows: DataRowProps<TItem, TId>[] = [];
            const nodeInfo = tree.getNodeInfo(parentId);

            const ids = tree.getChildrenIdsByParentId(parentId);

            for (let n = 0; n < ids.length; n++) {
                const id = ids[n];
                const item = tree.getById(id);
                if (item === NOT_FOUND_RECORD) {
                    continue;
                }

                const row = this.getRowProps(item, rows.length);
                if (appendRows && (!this.isPartialLoad() || (this.isPartialLoad() && rows.length < lastIndex))) {
                    rows.push(row);
                    layerRows.push(row);
                    currentLevelRows++;
                }

                stats = this.getRowStats(row, stats);
                row.isLastChild = n === ids.length - 1 && nodeInfo.count === ids.length;
                row.indent = isFlattenSearch ? 0 : row.path.length + 1;
                const estimatedChildrenCount = this.getEstimatedChildrenCount(id);
                if (!isFlattenSearch && estimatedChildrenCount !== undefined) {
                    const childrenIds = tree.getChildrenIdsByParentId(id);

                    if (estimatedChildrenCount > 0) {
                        row.isFolded = this.isFolded(item);
                        row.onFold = row.isFoldable && this.handleOnFold;

                        if (childrenIds.length > 0) {
                        // some children are loaded
                            const childStats = iterateNode(id, appendRows && !row.isFolded);
                            row.isChildrenChecked = row.isChildrenChecked || childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats = this.mergeStats(stats, childStats);
                        // while searching and no children in visible tree, no need to append placeholders.
                        } else if (!this.value.search && !row.isFolded && appendRows) {
                        // children are not loaded
                            const parentsWithRow = [...row.path, tree.getPathItem(item)];
                            for (let m = 0; m < estimatedChildrenCount && rows.length < lastIndex; m++) {
                                const loadingRow = this.getLoadingRow('_loading_' + rows.length, rows.length, parentsWithRow);
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
                    pinned[this.idToKey(row.id)] = row.index;
                    if (!pinnedByParentId[this.idToKey(row.parentId)]) {
                        pinnedByParentId[this.idToKey(row.parentId)] = [];
                    }
                    pinnedByParentId[this.idToKey(row.parentId)]?.push(row.index);
                }
            }

            const pathToParent = tree.getPathById(parentId);
            const parent = tree.getById(parentId);
            const parentPathItem = parent !== NOT_FOUND_RECORD ? [tree.getPathItem(parent)] : [];
            const path = parentId ? [...pathToParent, ...parentPathItem] : pathToParent;
            if (appendRows) {
                let missingCount: number = this.getMissingRecordsCount(parentId, rows.length, currentLevelRows);
                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }

                // Append loading rows, stop at lastIndex (last row visible)
                while (rows.length < lastIndex && missingCount > 0) {
                    const row = this.getLoadingRow('_loading_' + rows.length, rows.length, path);
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

    const selectAll = useMemo(() => {
        if (stats.isSomeCheckable && this.isSelectAllEnabled()) {
            return {
                value: stats.isSomeCheckboxEnabled ? stats.isAllChecked : false,
                onValueChange: this.handleSelectAll,
                indeterminate: this.value.checked && this.value.checked.length > 0 && !stats.isAllChecked,
            };
        } else if (tree.getRootIds().length === 0 && this.props.rowOptions?.checkbox?.isVisible && this.isSelectAllEnabled()) {
            // Nothing loaded yet, but we guess that something is checkable. Add disabled checkbox for less flicker.
            return {
                value: false,
                onValueChange: () => {},
                isDisabled: true,
                indeterminate: this.value.checked?.length > 0,
            };
        }
        return null;
    }, [stats]);
}
