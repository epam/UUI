import { useCallback, useMemo, useState } from 'react';
import { SelectedCellData } from '@epam/uui-core';
import type { SelectionManager, SelectionManagerProps, DataTableSelectionRange, CopyOptions } from '../types';
import { getCell, getCellToCopyFrom, getNormalizedLimits } from './helpers';

export const useSelectionManager = <TItem, TId, TFilter>({ rows, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const [selectionRange, setSelectionRange] = useState<DataTableSelectionRange>(null);
    const cellToCopyFrom = useMemo(
        () => getCellToCopyFrom<TItem, TId, TFilter>(selectionRange, rows, columns),
        [selectionRange?.startColumnIndex, selectionRange?.startRowIndex, rows, columns],
    );

    const canBeSelected = useCallback((rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
        const cell = getCell(rowIndex, columnIndex, rows, columns);
        if (!cellToCopyFrom && copyTo) return false;
        if (copyFrom) return !!cell.column.canCopy?.(cell);

        return !!cell.column.canAcceptCopy?.(cellToCopyFrom, cell);
    }, [cellToCopyFrom, rows, columns]);

    const shouldSelectCell = useCallback((row: number, column: number) => {
        if (selectionRange.startRowIndex === row && selectionRange.startColumnIndex === column) {
            return canBeSelected(row, column, { copyFrom: true });
        }
        return canBeSelected(row, column, { copyTo: true });
    }, [canBeSelected, selectionRange]);

    const getSelectedCells = useCallback((): SelectedCellData<TItem>[] => {
        if (!selectionRange) return [];

        const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = selectionRange;
        const [startRow, endRow] = getNormalizedLimits(startRowIndex, endRowIndex);
        const [startColumn, endColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);

        const selectedCells = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let column = startColumn; column <= endColumn; column++) {
                if (shouldSelectCell(row, column)) {
                    const cell = getCell(row, column, rows, columns);
                    selectedCells.push(cell);
                }
            }
        }

        return selectedCells;
    }, [selectionRange, rows, columns, canBeSelected, shouldSelectCell]);

    return { selectionRange, setSelectionRange, canBeSelected, getSelectedCells, cellToCopyFrom };
};
