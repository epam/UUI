import React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import css from './DataTableCellOverlay.scss';
import { useSelectionParams } from "./useSelectionParams";
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange, selectionRange, canBeSelected } = useContext(DataTableSelectionContext);

    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex, columnIndex });

    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const canCopyFrom = canBeSelected?.(rowIndex, columnIndex, { copyFrom: true });
    const borderClassNames = isSelected && (!selectionRange?.isCopying
        ? cx(
            'uui-selected-cell',
            isTop && 'uui-selected-cell-top',
            isRight && 'uui-selected-cell-right',
            isBottom && 'uui-selected-cell-bottom',
            isLeft && 'uui-selected-cell-left',
        )
        : canBeSelected?.(rowIndex, columnIndex, { copyTo: true }) && cx(
            'uui-selected-cell',
            (isTop || !canBeSelected(rowIndex - 1, columnIndex, { copyTo: true })) && 'uui-selected-cell-top',
            (isRight || !canBeSelected(rowIndex, columnIndex + 1, { copyTo: true })) && 'uui-selected-cell-right',
            (isBottom || !canBeSelected(rowIndex + 1, columnIndex, { copyTo: true })) && 'uui-selected-cell-bottom',
            (isLeft || !canBeSelected(rowIndex, columnIndex - 1, { copyTo: true })) && 'uui-selected-cell-left',
        ));

    const overlay = (
        <div
            className={ cx(
                css.root,
                props.isInvalid && uuiMod.invalid,
                props.inFocus && uuiMod.focus,
                props.cx,
                borderClassNames,
            ) }
        >
            { (props.inFocus && canCopyFrom) && <div
                className={ cx(css.copyingMarker, 'uui-copying-marker') }
                onPointerDown={ handleCopyingMarkerPointerDown } onClick={ e => e.stopPropagation() }
            /> }
        </div>
    );

    // Wrap to add validation tooltip
    if (props.inFocus) {
        return props.renderTooltip({
            trigger: 'manual',
            placement: 'top',
            isVisible: props.isInvalid,
            content: props.validationMessage,
            children: overlay,
        });
    } else {
        return overlay;
    }
}