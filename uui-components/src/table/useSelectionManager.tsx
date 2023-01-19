import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { BaseCellData, CellData, RowData, RowsData, SelectedCellsData } from '@epam/uui-core';

export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

export interface SelectionManagerProps<T> {
    data: RowsData<T>;
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

const getCell = <T,>(rowIndex: number, columnIndex: number, data: RowsData<T>) => data[rowIndex]?.[columnIndex];

const getCopyFromCell = <T,>(selectionRange: SelectionRange | null, data: RowsData<T>): CellData<T> | null => {
    if (selectionRange === null) {
        return null;
    }

    const { startRowIndex, startColumnIndex } = selectionRange;
    return getCell(startRowIndex, startColumnIndex, data);
};

const getNormalizedLimits = (startIndex: number, endIndex: number) => startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

const convertToBaseCellData = <T,>({ canAcceptCopy, canCopy, ...rest }: CellData<T>): BaseCellData<T> => rest;

export const useSelectionManager = <T,>({ data }: SelectionManagerProps<T>): SelectionManager<T> => {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);
    const cellToCopyFrom = useMemo(() => getCopyFromCell<T>(selectionRange, data), [selectionRange, data]);
    const range = useMemo(() => ({ selectionRange, setSelectionRange }), [selectionRange]);

    const canBeSelected = useCallback((rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
        const cell = getCell(rowIndex, columnIndex, data);
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
    }, [cellToCopyFrom, data]);

    const shouldSelectCell = useCallback((row: number, column: number) => {
        if (selectionRange.startRowIndex === row && selectionRange.startColumnIndex === column) {
            return canBeSelected(row, column, { copyFrom: true });
        }
        return canBeSelected(row, column, { copyTo: true });
    }, [canBeSelected, selectionRange]);

    const getSelectedCells = useCallback((): SelectedCellsData<T> => {
        const { startRowIndex, startColumnIndex, endRowIndex, endColumnIndex } = selectionRange;
        const [startRow, endRow] = getNormalizedLimits(startRowIndex, endRowIndex);
        const [startColumn, endColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);

        return data.reduce<SelectedCellsData<T>>((selected, row, rowIndex) => {
            if (rowIndex < startRow || rowIndex > endRow) {
                return selected;
            }

            const rowKeys = Object.keys(row) as unknown as Array<keyof RowData<T>>;
            return [
                ...selected,
                ...rowKeys.reduce<BaseCellData<T>[]>((selectedColumns, column) => {
                    const columnIndex = row[column].columnIndex;
                    if (columnIndex < startColumn || columnIndex > endColumn || !shouldSelectCell(rowIndex, columnIndex)) {
                        return selectedColumns;
                    }

                    return [...selectedColumns, convertToBaseCellData(row[column])];
                }, []),
            ];
        }, []);

    }, [selectionRange, data, canBeSelected, shouldSelectCell]);

    return {
        ...range,
        canBeSelected,
        getSelectedCells,
        cellToCopyFrom: cellToCopyFrom ? convertToBaseCellData(cellToCopyFrom) : null,
    };
};
