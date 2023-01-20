import { Lens } from "../data/lenses";
import { BaseCellData, CellData, DataColumnProps, DataRowProps, IEditable, SelectionRange } from "../types";

export const getCell = <TItem, TId>(rowIndex: number, columnIndex: number, rows: DataRowProps<TItem, TId>[], columns: DataColumnProps<TItem, TId>[]) => {
    const row = rows[rowIndex];
    const column = columns[columnIndex];

    const rowLens = Lens.onEditable(row as IEditable<TItem>);
    return {
        key: column.key,
        columnIndex,
        rowIndex,
        rowLens,
        canCopy: column.canCopy,
        canAcceptCopy: column.canAcceptCopy,
    };
};

export const getCopyFromCell = <TItem, TId>(
    selectionRange: SelectionRange | null,
    rows: DataRowProps<TItem, TId>[],
    columns: DataColumnProps<TItem, TId>[],
): CellData<TItem> | null => {
    if (selectionRange === null) {
        return null;
    }

    const { startRowIndex, startColumnIndex } = selectionRange;
    return getCell(startRowIndex, startColumnIndex, rows, columns);
};

export const getNormalizedLimits = (startIndex: number, endIndex: number) =>
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

export const convertToBaseCellData = <TItem,>({ canAcceptCopy, canCopy, ...rest }: CellData<TItem>): BaseCellData<TItem> => rest;
