import { useCallback, useMemo, useState } from 'react';
import { DataTableSelectedCellData, useDebounce } from '@epam/uui-core';
import type { SelectionManager, SelectionManagerProps, DataTableSelectionRange, CopyOptions } from '../types';
import { getCell, getCellPosition, getCellToCopyFrom, getNormalizedLimits } from './helpers';

export const useSelectionManager = <TItem, TId, TFilter>({ rows, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const [selectionRange, setSelectionRange] = useState<DataTableSelectionRange>(null);
    const setSelectionRangeDebounced = useDebounce(setSelectionRange, 0);

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

    const getSelectedCells = useCallback((): DataTableSelectedCellData<TItem>[] => {
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

    const useCellSelectionInfo = useCallback((row: number, column: number) => {
        const { isCopying } = selectionRange || {};
        const { isTop, isBottom, isLeft, isRight, isSelected, isStartCell } = useMemo(
            () => getCellPosition(row, column, selectionRange),
            [row, column, selectionRange],
        );

        const canCopyFrom = useMemo(
            () => canBeSelected?.(row, column, { copyFrom: true }),
            [row, column, canBeSelected],
        );
        const canAcceptCopy = useMemo(
            () => canBeSelected?.(row, column, { copyTo: true }),
            [row, column, canBeSelected],
        );

        const showBorder = useCallback((isBorderPosition: boolean, neighborRow: number, neighborColumn: number) => {
            if (isStartCell) return true;
            if (!isSelected) return false;
            if (!isCopying) {
                return isBorderPosition;
            }

            return canAcceptCopy && (isBorderPosition || !canBeSelected?.(neighborRow, neighborColumn, { copyTo: true }));
        }, [isSelected, isStartCell, canAcceptCopy, canBeSelected]);

        const showTopBorder = useMemo(() => showBorder(isTop, row - 1, column), [isTop, row, column, showBorder, isStartCell]);
        const showRightBorder = useMemo(() => showBorder(isRight, row, column + 1), [isRight, row, column, showBorder, isStartCell]);
        const showBottomBorder = useMemo(() => showBorder(isBottom, row + 1, column), [isBottom, row, column, showBorder, isStartCell]);
        const showLeftBorder = useMemo(() => showBorder(isLeft, row, column - 1), [isLeft, row, column, showBorder, isStartCell]);

        return {
            isSelected,
            showTopBorder,
            showRightBorder,
            showBottomBorder,
            showLeftBorder,
            canCopyFrom,
            canAcceptCopy,
        };
    }, [selectionRange, canBeSelected]);

    return { selectionRange, setSelectionRange: setSelectionRangeDebounced, canBeSelected, getSelectedCells, cellToCopyFrom, useCellSelectionInfo };
};
