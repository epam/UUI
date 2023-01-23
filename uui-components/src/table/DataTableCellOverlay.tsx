import React, { useCallback, useMemo } from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import css from './DataTableCellOverlay.scss';
import { useSelectionParams, DataTableSelectionContext } from "./tableCellsSelection";
import { PointerEventHandler, useContext } from "react";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange, selectionRange, canBeSelected } = useContext(DataTableSelectionContext);

    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex, columnIndex });

    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const showSelect = useCallback(() => isSelected && selectionRange?.isCopying, [isSelected, selectionRange?.isCopying]);

    const canCopyFrom = useMemo(
        () => canBeSelected?.(rowIndex, columnIndex, { copyFrom: true }),
        [rowIndex, columnIndex, canBeSelected],
    );

    const canAcceptCopy = useMemo(
        () => canBeSelected?.(rowIndex, columnIndex, { copyTo: true }),
        [rowIndex, columnIndex, canBeSelected],
    );

    const canBeSelectedTop = useMemo(
        () => showSelect() && (isTop || !canBeSelected?.(rowIndex - 1, columnIndex, { copyTo: true })),
        [isSelected, selectionRange?.isCopying, isTop, rowIndex, columnIndex, canBeSelected, showSelect],
    );

    const canBeSelectedRight = useMemo(
        () => showSelect() && (isRight || !canBeSelected?.(rowIndex, columnIndex + 1, { copyTo: true })),
        [isSelected, selectionRange?.isCopying, isRight, rowIndex, columnIndex, canBeSelected, showSelect],
    );


    const canBeSelectedBottom = useMemo(
        () => showSelect() && (isBottom || !canBeSelected?.(rowIndex + 1, columnIndex, { copyTo: true })),
        [isSelected, selectionRange?.isCopying, isBottom, rowIndex, columnIndex, canBeSelected, showSelect],
    );

    const canBeSelectedLeft = useMemo(
        () => showSelect() && (isLeft || !canBeSelected?.(rowIndex, columnIndex - 1, { copyTo: true })),
        [isSelected, selectionRange?.isCopying, isLeft, rowIndex, columnIndex, canBeSelected, showSelect],
    );

    const borderClassNames = isSelected && (!selectionRange?.isCopying
        ? cx(
            'uui-selected-cell',
            isTop && 'uui-selected-cell-top',
            isRight && 'uui-selected-cell-right',
            isBottom && 'uui-selected-cell-bottom',
            isLeft && 'uui-selected-cell-left',
        )
        : canAcceptCopy && cx(
            'uui-selected-cell',
            canBeSelectedTop && 'uui-selected-cell-top',
            canBeSelectedRight && 'uui-selected-cell-right',
            canBeSelectedBottom && 'uui-selected-cell-bottom',
            canBeSelectedLeft && 'uui-selected-cell-left',
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