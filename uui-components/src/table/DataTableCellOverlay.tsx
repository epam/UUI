import React, { useCallback } from 'react';
import {
    blurFocusedElement, cx, ICanBeInvalid, IHasCX, TooltipCoreProps, uuiMod, IHasValidationMessage, ICanBeReadonly,
} from '@epam/uui-core';
import css from './DataTableCellOverlay.module.scss';
import { DataTableSelectionContext } from './tableCellsSelection';
import { PointerEventHandler, useContext } from 'react';

export interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid, IHasValidationMessage, ICanBeReadonly {
    inFocus: boolean;
    columnIndex: number;
    rowIndex: number;
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;
}

const uuiDataTableCellOverlayMarkers = {
    uuiTableCellOverlay: 'uui-table-cell-overlay',
    uuiTableCellSelectionInProgress: 'uui-table-cell-selection-in-progress',
    uuiTableCellSelected: 'uui-table-cell-selected',
    uuiTableCellSelectedTop: 'uui-table-cell-selected-top',
    uuiTableCellSelectedRight: 'uui-table-cell-selected-right',
    uuiTableCellSelectedBottom: 'uui-table-cell-selected-bottom',
    uuiTableCellSelectedLeft: 'uui-table-cell-selected-left',
    uuiCopyingMarker: 'uui-copying-marker',
    uuiCopyingMarkerHover: 'uui-copying-marker-hover',
} as const;

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { selectionRange, setSelectionRange, getCellSelectionInfo } = useContext(DataTableSelectionContext);
    const {
        isSelected, showBottomBorder, showLeftBorder, showRightBorder, showTopBorder, canCopyFrom, isStartCell,
    } = getCellSelectionInfo?.(rowIndex, columnIndex) ?? {};

    const { isCopying } = selectionRange ?? {};

    const handleCopyingMarkerPointerDown: PointerEventHandler = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();

            blurFocusedElement();

            setSelectionRange({
                startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true,
            });
        },
        [
            setSelectionRange, columnIndex, rowIndex,
        ],
    );

    const handlePointerEnter: PointerEventHandler = useCallback(() => {
        if (!selectionRange) return;
        setSelectionRange((prevState) => ({ ...prevState, endRowIndex: rowIndex, endColumnIndex: columnIndex }));
    }, [
        selectionRange, rowIndex, columnIndex,
    ]);

    const borderClassNames = isSelected
        && cx(
            uuiDataTableCellOverlayMarkers.uuiTableCellSelected,
            showTopBorder && uuiDataTableCellOverlayMarkers.uuiTableCellSelectedTop,
            showRightBorder && uuiDataTableCellOverlayMarkers.uuiTableCellSelectedRight,
            showBottomBorder && uuiDataTableCellOverlayMarkers.uuiTableCellSelectedBottom,
            showLeftBorder && uuiDataTableCellOverlayMarkers.uuiTableCellSelectedLeft,
        );

    const showMarkerHover = !isCopying && canCopyFrom && !props.inFocus;
    const showMarker = (isCopying && isStartCell) || (props.inFocus && canCopyFrom) || showMarkerHover;

    const overlay = (
        <div
            onPointerEnter={ handlePointerEnter }
            className={ cx(
                uuiDataTableCellOverlayMarkers.uuiTableCellOverlay,
                selectionRange && uuiDataTableCellOverlayMarkers.uuiTableCellSelectionInProgress,
                props.cx,
                css.root,
                css.overlay,
                borderClassNames,
                props.inFocus && uuiMod.focus,
                props.isInvalid && uuiMod.invalid,
                props.isReadonly && uuiMod.readonly,
            ) }
        >
            {showMarker && (
                <div
                    className={ cx(
                        css.copyingMarker,
                        showMarkerHover ? uuiDataTableCellOverlayMarkers.uuiCopyingMarkerHover : uuiDataTableCellOverlayMarkers.uuiCopyingMarker,
                    ) }
                    onPointerDown={ handleCopyingMarkerPointerDown }
                    onClick={ (e) => e.stopPropagation() }
                />
            )}
        </div>
    );

    // Wrap to add validation tooltip
    if (props.inFocus) {
        return props.renderTooltip({
            placement: 'top',
            value: props.isInvalid,
            content: props.validationMessage,
            children: overlay,
        });
    } else {
        return overlay;
    }
}
