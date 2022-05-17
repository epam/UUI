import React, { useContext, useMemo } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";

export interface ReplicationHookParams<Value> {
    columnIndex: number;
    rowIndex: number;
}

export function useSelectionParams<Value = any>({ columnIndex, rowIndex }: ReplicationHookParams<Value>) {
    const { selectionRange } = useContext(DataTableSelectionContext);

    const isHorizontalDirectionABS = selectionRange?.startColumnIndex <= selectionRange?.endColumnIndex;
    const isVerticalDirectionABS = selectionRange?.startRowIndex <= selectionRange?.endRowIndex;

    const leftColumnIndex = isHorizontalDirectionABS ? selectionRange?.startColumnIndex : selectionRange?.endColumnIndex;
    const rightColumnIndex = isHorizontalDirectionABS ? selectionRange?.endColumnIndex : selectionRange?.startColumnIndex;
    const topRowIndex = isVerticalDirectionABS ? selectionRange?.startRowIndex : selectionRange?.endRowIndex;
    const bottomRowIndex = isVerticalDirectionABS ? selectionRange?.endRowIndex : selectionRange?.startRowIndex;

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
