import React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import css from './DataTableCellOverlay.scss';
import { DataTableSelectionContext } from "./tableCellsSelection";
import { PointerEventHandler, useContext } from "react";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange, useCellSelectionInfo } = useContext(DataTableSelectionContext);
    const {
        isSelected, showBottomBorder, showLeftBorder, showRightBorder, showTopBorder, canCopyFrom,
    } = useCellSelectionInfo?.(rowIndex, columnIndex) ?? {};

    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const borderClassNames = isSelected && cx(
        'uui-selected-cell',
        showTopBorder && 'uui-selected-cell-top',
        showRightBorder && 'uui-selected-cell-right',
        showBottomBorder && 'uui-selected-cell-bottom',
        showLeftBorder && 'uui-selected-cell-left',
    );

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