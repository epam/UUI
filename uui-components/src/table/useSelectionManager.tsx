import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { BaseCellData, CellData, DataColumnProps, DataRowProps, IEditable, Lens, SelectedCellsData } from '@epam/uui-core';

export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface SelectionManagerProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    columns: DataColumnProps<TItem, TId>[];
}

export interface SelectionManager<T> {
    selectionRange: SelectionRange;
    setSelectionRange: Dispatch<SetStateAction<SelectionRange>>;
    canBeSelected: (rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => boolean;
    getSelectedCells: () => SelectedCellsData<T>;
    cellToCopyFrom: BaseCellData<T>;
}

type CopyOptions =
    | { copyFrom: true; copyTo?: boolean; }
    | { copyFrom?: boolean, copyTo: true };

const getCell = <TItem, TId>(rowIndex: number, columnIndex: number, rows: DataRowProps<TItem, TId>[], columns: DataColumnProps<TItem, TId>[]) => {
    const row = rows[rowIndex];
    const column = columns[columnIndex];

    const rowLens = Lens.onEditable(row as IEditable<TItem>);
    const key = column.key as keyof TItem;
    return {
        key,
        value: rowLens.prop(key).get(),
        columnIndex,
        rowIndex,
        rowLens,
        canCopy: column.canCopy,
        canAcceptCopy: column.canAcceptCopy,
    };
};

const getCopyFromCell = <TItem, TId>(selectionRange: SelectionRange | null, rows: DataRowProps<TItem, TId>[], columns: DataColumnProps<TItem, TId>[]): CellData<TItem> | null => {
    if (selectionRange === null) {
        return null;
    }

    const { startRowIndex, startColumnIndex } = selectionRange;
    return getCell(startRowIndex, startColumnIndex, rows, columns);
};

const getNormalizedLimits = (startIndex: number, endIndex: number) =>
    startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

const convertToBaseCellData = <TItem,>({ canAcceptCopy, canCopy, ...rest }: CellData<TItem>): BaseCellData<TItem> => rest;

export const useSelectionManager = <TItem, TId>({ rows, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);
    const cellToCopyFrom = useMemo(() => getCopyFromCell<TItem, TId>(selectionRange, rows, columns), [selectionRange, rows, columns]);
    const range = useMemo(() => ({ selectionRange, setSelectionRange }), [selectionRange]);

    const canBeSelected = useCallback((rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
        const cell = getCell(rowIndex, columnIndex, rows, columns);
        if (!cellToCopyFrom && copyTo) {
            return false;
        }

        if (copyFrom && copyTo) {
            return !!(cell.canCopy?.(cell) && cell.canAcceptCopy?.(cellToCopyFrom, cell));
        }
        if (copyFrom) {
            return !!cell.canCopy?.(cell);
        }

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
