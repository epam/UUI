import { useCallback, useMemo, useState } from 'react';
import type { SelectedCellsData, SelectionManager, SelectionManagerProps, SelectionRange, CopyOptions } from '../types';
import { convertToBaseCellData, getCell, getCopyFromCell, getNormalizedLimits } from '../helpers';

export const useSelectionManager = <TItem, TId>({ rows, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);
    const cellToCopyFrom = useMemo(() => getCopyFromCell<TItem, TId>(selectionRange, rows, columns), [selectionRange, rows, columns]);
    const range = useMemo(() => ({ selectionRange, setSelectionRange }), [selectionRange]);

    const canBeSelected = useCallback((rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
        const cell = getCell(rowIndex, columnIndex, rows, columns);
        if (!cellToCopyFrom && copyTo) return false;
        if (copyFrom) return !!cell.canCopy?.(cell);

        return !!cell.canAcceptCopy?.(cellToCopyFrom, cell);
    }, [cellToCopyFrom, rows, columns]);

    const shouldSelectCell = useCallback((row: number, column: number) => {
        if (selectionRange.startRowIndex === row && selectionRange.startColumnIndex === column) {
            return canBeSelected(row, column, { copyFrom: true });
        }
        return canBeSelected(row, column, { copyTo: true });
    }, [canBeSelected, selectionRange]);

    const getSelectedCells = useCallback((): SelectedCellsData<TItem> => {
        const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = selectionRange;
        const [startRow, endRow] = getNormalizedLimits(startRowIndex, endRowIndex);
        const [startColumn, endColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);

        const selectedCells = [];
        for (let row = startRow; row <= endRow; row++) {
            for (let column = startColumn; column <= endColumn; column++) {
                if (shouldSelectCell(row, column)) {
                    const cell = getCell(row, column, rows, columns);
                    selectedCells.push(convertToBaseCellData(cell));
                }
            }
        }

        return selectedCells;
    }, [selectionRange, rows, columns, canBeSelected, shouldSelectCell]);

    return {
        ...range,
        canBeSelected,
        getSelectedCells,
        cellToCopyFrom: cellToCopyFrom ? convertToBaseCellData(cellToCopyFrom) : null,
    };
};
