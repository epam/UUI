import { DataColumnProps, DataRowProps, SelectedCellData } from "@epam/uui-core";
import { DataTableSelectionRange } from "../types";

export const getCell = <TItem, TId>(rowIndex: number, columnIndex: number, rows: DataRowProps<TItem, TId>[], columns: DataColumnProps<TItem, TId>[]) => {
    const row = rows[rowIndex];
    const column = columns[columnIndex];

    if (!row || !column) {
        return null;
    }
    return { column, row };
};

export const getCellToCopyFrom = <TItem, TId, TFilter>(
    selectionRange: DataTableSelectionRange | null,
    rows: DataRowProps<TItem, TId>[],
    columns: DataColumnProps<TItem, TId>[],
): SelectedCellData<TItem, TId, TFilter> | null => {
    if (selectionRange === null) {
        return null;
    }

    const { startRowIndex, startColumnIndex } = selectionRange;
    return getCell(startRowIndex, startColumnIndex, rows, columns);
};

export const getNormalizedLimits = (startIndex: number, endIndex: number) =>
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
