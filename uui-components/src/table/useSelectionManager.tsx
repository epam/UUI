import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { CellData, RowsData } from '@epam/uui-core';


export interface SelectionRange {
    startColumnIndex: number;
    startRowIndex: number;
    endColumnIndex: number;
    endRowIndex: number;
    isCopying?: boolean;
}

interface SelectionManagerProps<T> {
    data: RowsData<T>;
}

export interface SelectionManager {
    selectionRange: SelectionRange;
    setSelectionRange: Dispatch<SetStateAction<SelectionRange>>;
    canBeSelected: (rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => boolean;
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


export const useSelectionManager = <T,>({ data }: SelectionManagerProps<T>): SelectionManager => {
    const [selectionRange, setSelectionRange] = useState<SelectionRange>(null);

    const cellToCopyFrom = useMemo(() => getCopyFromCell(selectionRange, data), [selectionRange, data]);

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

    const range = useMemo(() => ({ selectionRange, setSelectionRange }), [selectionRange]);

    return {
        ...range,
        canBeSelected,
    };
};
