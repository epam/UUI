import { useCallback, useMemo, useState } from 'react';
import { DataTableSelectedCellData } from '@epam/uui-core';
import type {
    SelectionManager, SelectionManagerProps, DataTableSelectionRange, CopyOptions,
} from '../types';
import {
    getCell, getCellPosition, getStartCell, getNormalizedLimits,
} from './helpers';

export const useSelectionManager = <TItem, TId, TFilter>({ rowsByIndex, columns }: SelectionManagerProps<TItem, TId>): SelectionManager<TItem> => {
    const [selectionRange, setSelectionRange] = useState<DataTableSelectionRange>(null);

    const startCell = useMemo(
        () => getStartCell<TItem, TId, TFilter>(selectionRange, rowsByIndex, columns),
        [
            selectionRange?.startColumnIndex, selectionRange?.startRowIndex, rowsByIndex, columns,
        ],
    );

    const canBeSelected = useCallback(
        (rowIndex: number, columnIndex: number, { copyFrom, copyTo }: CopyOptions) => {
            const cell = getCell(rowIndex, columnIndex, rowsByIndex, columns);

            if (!startCell && copyTo) return false;
            if (copyFrom) {
                return !!cell.column.canCopy?.(cell);
            }

            return !!cell.column.canAcceptCopy?.(startCell, cell);
        },
        [startCell, columns, rowsByIndex],
    );

    const shouldSelectCell = useCallback(
        (rowIndex: number, columnIndex: number) => {
            if (selectionRange.startRowIndex === rowIndex && selectionRange.startColumnIndex === columnIndex) {
                return canBeSelected(rowIndex, columnIndex, { copyFrom: true });
            }
            return canBeSelected(rowIndex, columnIndex, { copyTo: true });
        },
        [canBeSelected, selectionRange],
    );

    const getSelectedCells = useCallback((): DataTableSelectedCellData<TItem>[] => {
        if (!selectionRange) return [];

        const {
            startRowIndex, startColumnIndex, endRowIndex, endColumnIndex,
        } = selectionRange;
        const [startRow, endRow] = getNormalizedLimits(startRowIndex, endRowIndex);
        const [startColumn, endColumn] = getNormalizedLimits(startColumnIndex, endColumnIndex);

        const selectedCells = [];
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            for (let columnIndex = startColumn; columnIndex <= endColumn; columnIndex++) {
                if (shouldSelectCell(rowIndex, columnIndex)) {
                    const cell = getCell(rowIndex, columnIndex, rowsByIndex, columns);
                    selectedCells.push(cell);
                }
            }
        }

        return selectedCells;
    }, [
        selectionRange, columns, shouldSelectCell, rowsByIndex,
    ]);

    const getCellSelectionInfo = useCallback(
        (rowIndex: number, columnIndex: number) => {
            const { isCopying } = selectionRange || {};
            const {
                isTop, isBottom, isLeft, isRight, isSelected, isStartCell,
            } = getCellPosition(rowIndex, columnIndex, selectionRange);
            const canCopyFrom = canBeSelected?.(rowIndex, columnIndex, { copyFrom: true });
            const canAcceptCopy = canBeSelected?.(rowIndex, columnIndex, { copyTo: true });

            const showBorder = (isBorderPosition: boolean, neighborRow: number, neighborColumn: number) => {
                if (isStartCell) return true;
                if (!isSelected) return false;
                if (!isCopying) {
                    return isBorderPosition;
                }
                return canAcceptCopy && (isBorderPosition || !canBeSelected?.(neighborRow, neighborColumn, { copyTo: true }));
            };

            const showTopBorder = showBorder(isTop, rowIndex - 1, columnIndex);
            const showRightBorder = showBorder(isRight, rowIndex, columnIndex + 1);
            const showBottomBorder = showBorder(isBottom, rowIndex + 1, columnIndex);
            const showLeftBorder = showBorder(isLeft, rowIndex, columnIndex - 1);

            return {
                isSelected,
                canCopyFrom,
                canAcceptCopy,
                isStartCell,
                showTopBorder,
                showRightBorder,
                showBottomBorder,
                showLeftBorder,
            };
        },
        [selectionRange, canBeSelected],
    );

    return {
        selectionRange, setSelectionRange, getSelectedCells, startCell, getCellSelectionInfo,
    };
};
