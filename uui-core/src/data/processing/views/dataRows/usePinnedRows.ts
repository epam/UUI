import { useCallback } from 'react';
import { DataRowProps } from '../../../../types';
import { idToKey } from '../helpers';

export interface UsePinnedRowsProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    pinned: Record<string, number>;
    pinnedByParentId: Record<string, number[]>;
}

export function usePinnedRows<TItem, TId>({
    rows,
    pinned,
    pinnedByParentId,
}: UsePinnedRowsProps<TItem, TId>) {
    const getLastPinnedBeforeRow = useCallback((row: DataRowProps<TItem, TId>, pinnedIndexes: number[]) => {
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
    }, [rows]);

    const getLastHiddenPinnedByParent = useCallback((row: DataRowProps<TItem, TId>, alreadyAdded: TId[]) => {
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
    }, [pinnedByParentId, rows, getLastPinnedBeforeRow]);

    const withPinnedRows = useCallback((allRows: DataRowProps<TItem, TId>[]) => {
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
    }, [pinned, rows, getLastHiddenPinnedByParent]);

    return withPinnedRows;
}
