import { useContext, useMemo } from "react";
import { DataTableSelectionContext } from "../DataTableSelectionContext";

export interface CellConfig {
    columnIndex: number;
    rowIndex: number;
    canSelect?: (coordinates: Pick<CellConfig, 'columnIndex' | 'rowIndex'>) => boolean;
}

export function useSelectionParams({ columnIndex, rowIndex }: CellConfig) {
    const { selectionRange } = useContext(DataTableSelectionContext);
    const { startColumnIndex, startRowIndex, endColumnIndex, endRowIndex } = selectionRange || {};

    const isHorizontalDirectionABS = startColumnIndex <= endColumnIndex;
    const isVerticalDirectionABS = startRowIndex <= endRowIndex;

    const leftColumnIndex = isHorizontalDirectionABS ? startColumnIndex : endColumnIndex;
    const rightColumnIndex = isHorizontalDirectionABS ? endColumnIndex : startColumnIndex;
    const topRowIndex = isVerticalDirectionABS ? startRowIndex : endRowIndex;
    const bottomRowIndex = isVerticalDirectionABS ? endRowIndex : startRowIndex;

    const isSelected =
        columnIndex >= leftColumnIndex && columnIndex <= rightColumnIndex
        && rowIndex >= topRowIndex && rowIndex <= bottomRowIndex;

    const isLeft = columnIndex === leftColumnIndex;
    const isRight = columnIndex === rightColumnIndex;
    const isTop = rowIndex === topRowIndex;
    const isBottom = rowIndex === bottomRowIndex;

    return useMemo(() => ({
        isTop,
        isRight,
        isBottom,
        isLeft,
        isSelected,
    }), [isSelected, isLeft, isRight, isTop, isBottom, !!selectionRange]);
}
