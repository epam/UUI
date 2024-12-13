import { DataColumnProps, DataRowProps, DataTableSelectedCellData } from '@epam/uui-core';
import { DataTableSelectionRange } from '../types';

export const getCell = <TItem, TId>(
    rowIndex: number,
    columnIndex: number,
    rowsByIndex: Map<number,
    DataRowProps<TItem, TId>>,
    columns: DataColumnProps<TItem, TId>[],
) => {
    const row = rowsByIndex.get(rowIndex);
    const column = columns[columnIndex];

    if (!row || !column) {
        return null;
    }
    return { column, row };
};

export const getStartCell = <TItem, TId, TFilter>(
    selectionRange: DataTableSelectionRange | null,
    rowsByIndex: Map<number, DataRowProps<TItem, TId>>,
    columns: DataColumnProps<TItem, TId>[],
): DataTableSelectedCellData<TItem, TId, TFilter> | null => {
    if (selectionRange === null) {
        return null;
    }

    const { startRowIndex, startColumnIndex } = selectionRange;
    return getCell(startRowIndex, startColumnIndex, rowsByIndex, columns);
};

export const getNormalizedLimits = (startIndex: number, endIndex: number) => (startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex]);

export const getCellPosition = (row: number, column: number, selectionRange: DataTableSelectionRange) => {
    const {
        startColumnIndex, startRowIndex, endColumnIndex, endRowIndex,
    } = selectionRange || {};

    const [leftColumn, rightColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);
    const [topRow, bottomRow] = getNormalizedLimits(startRowIndex, endRowIndex);

    const isSelected = column >= leftColumn && column <= rightColumn && row >= topRow && row <= bottomRow;
    const isStartCell = row === startRowIndex && column === startColumnIndex;

    return {
        isLeft: column === leftColumn,
        isRight: column === rightColumn,
        isTop: row === topRow,
        isBottom: row === bottomRow,
        isSelected,
        isStartCell,
    };
};
