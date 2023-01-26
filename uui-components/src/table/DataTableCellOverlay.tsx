import React, { useCallback } from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import css from './DataTableCellOverlay.scss';
import { DataTableSelectionContext } from "./tableCellsSelection";
import { PointerEventHandler, useContext } from "react";

export function DataTableCellOverlayComponent(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { selectionRange, setSelectionRange, getCellSelectionInfo } = useContext(DataTableSelectionContext);
    const {
        isSelected, showBottomBorder, showLeftBorder, showRightBorder, showTopBorder, canCopyFrom, isStartCell,
    } = getCellSelectionInfo?.(rowIndex, columnIndex) ?? {};

    const { isCopying } = selectionRange ?? {};
    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const handlePointerEnter: PointerEventHandler = useCallback(() => {
        if (!selectionRange) return;
        setSelectionRange(prevState => ({ ...prevState, endRowIndex: rowIndex, endColumnIndex: columnIndex }));
    }, [selectionRange, rowIndex, columnIndex]);

    const borderClassNames = isSelected && cx(
        'uui-selected-cell',
        showTopBorder && 'uui-selected-cell-top',
        showRightBorder && 'uui-selected-cell-right',
        showBottomBorder && 'uui-selected-cell-bottom',
        showLeftBorder && 'uui-selected-cell-left',
    );

    const showMarkerHover = !isCopying && canCopyFrom && !props.inFocus;
    const showMarker = (isCopying && isStartCell) || (props.inFocus && canCopyFrom) || showMarkerHover;

    const overlay = (
        <div
            onPointerEnter={ handlePointerEnter }
            className={ cx(
                css.root,
                props.isInvalid && uuiMod.invalid,
                props.inFocus && uuiMod.focus,
                props.cx,
                borderClassNames,
                selectionRange && css.selecting,
            ) }
        >
            { showMarker && <div
                className={ cx(css.copyingMarker, showMarkerHover ? 'uui-copying-marker-hover' : 'uui-copying-marker') }
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

export const DataTableCellOverlay = React.memo(DataTableCellOverlayComponent);