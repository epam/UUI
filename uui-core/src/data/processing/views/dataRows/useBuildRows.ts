import { useMemo } from 'react';
import { ITree, NOT_FOUND_RECORD, Tree } from '../tree';
import { DataRowPathItem, DataRowProps } from '../../../../types';
import { idToKey } from '../helpers';
import { NodeStats, getDefaultNodeStats, getRowStats, mergeStats } from './stats';
import { CommonTreeConfig } from '../tree/hooks/strategies/types/common';

export interface UseBuildRowsProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonTreeConfig<TItem, TId, TFilter>,
    'dataSourceState' | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    > {

    tree: ITree<TItem, TId>;

    getEstimatedChildrenCount: (id: TId) => number;
    getMissingRecordsCount: (id: TId, totalRowsCount: number, loadedChildrenCount: number) => number;
    maxVisibleRowIndex: number;

    getRowProps: (item: TItem, index: number) => DataRowProps<TItem, TId>;
    getLoadingRowProps: (id: any, index?: number, path?: DataRowPathItem<TId, TItem>[]) => DataRowProps<TItem, TId>;

    isLoading?: boolean;
}

export function useBuildRows<TItem, TId, TFilter = any>({
    tree,
    dataSourceState,
    getEstimatedChildrenCount,
    getMissingRecordsCount,
    cascadeSelection,
    maxVisibleRowIndex,
    getRowProps,
    getLoadingRowProps,
    isLoading = false,
}: UseBuildRowsProps<TItem, TId, TFilter>) {
    const buildRows = () => {
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

            const { ids, count } = tree.getItems(parentId);

            for (let n = 0; n < ids.length; n++) {
                const id = ids[n];
                const item = tree.getById(id);
                if (item === NOT_FOUND_RECORD) {
                    continue;
                }

                const row = getRowProps(item, rows.length);
                if (appendRows) {
                    rows.push(row);
                    layerRows.push(row);
                    currentLevelRows++;
                }

                stats = getRowStats(row, stats, cascadeSelection);
                row.isLastChild = n === ids.length - 1 && count === ids.length;
                const assumedChildrenOfParent = getEstimatedChildrenCount(parentId);
                row.indent = (!assumedChildrenOfParent && parentId !== undefined) ? 0 : row.path.length + 1;

                const estimatedChildrenCount = getEstimatedChildrenCount(id);
                if (estimatedChildrenCount !== undefined) {
                    const { ids: childrenIds } = tree.getItems(id);

                    if (estimatedChildrenCount > 0) {
                        if (childrenIds.length > 0) {
                        // some children are loaded
                            const childStats = iterateNode(id, appendRows && !row.isFolded);
                            row.isChildrenChecked = row.isChildrenChecked || childStats.isSomeChecked;
                            row.isChildrenSelected = row.isChildrenSelected || childStats.isSomeSelected;
                            stats = mergeStats(stats, childStats);
                        // while searching and no children in visible tree, no need to append placeholders.
                        } else if (!dataSourceState.search && !row.isFolded && appendRows) {
                        // children are not loaded
                            const parentsWithRow = [...row.path, Tree.getPathItem(item, tree)];
                            for (let m = 0; m < estimatedChildrenCount && rows.length < maxVisibleRowIndex; m++) {
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

            const pathToParent = Tree.getPathById(parentId, tree);
            const parent = tree.getById(parentId);
            const parentPathItem = parent !== NOT_FOUND_RECORD ? [Tree.getPathItem(parent, tree)] : [];
            const path = parentId ? [...pathToParent, ...parentPathItem] : pathToParent;
            if (appendRows) {
                let missingCount = getMissingRecordsCount(parentId, rows.length, currentLevelRows);
                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }
                // Append loading rows, stop at maxVisibleRowIndex (maximum assumed row visible)
                while (rows.length < maxVisibleRowIndex && missingCount > 0) {
                    const row = getLoadingRowProps('_loading_' + rows.length, rows.length, path);
                    rows.push(row);
                    layerRows.push(row);
                    currentLevelRows++;
                    missingCount--;
                }
            }

            const isListFlat = path.length === 0 && !layerRows.some((r) => r.isFoldable);
            if (isListFlat) {
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

    return useMemo(() => buildRows(), [tree, dataSourceState.folded, dataSourceState.checked, isLoading, dataSourceState.foldAll]);
}
