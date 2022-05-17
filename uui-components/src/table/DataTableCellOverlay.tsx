import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { useSelectionParams } from "./useSelectionParams";
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex: rowIndex, columnIndex: columnIndex });
    const { setSelectionRange } = useContext(DataTableSelectionContext);

    const handleReplicationMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex });
    };

    const borderClassNames = isSelected && cx(
        'uui-selected-cell',
        isTop && 'uui-selected-cell-top',
        isRight && 'uui-selected-cell-right',
        isBottom && 'uui-selected-cell-bottom',
        isLeft && 'uui-selected-cell-left',
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
                { props.inFocus && props.canCopyPaste && <div
                    className={ cx(css.replicationMarker, 'uui-replication-marker') }
                   onPointerDown={ handleReplicationMarkerPointerDown } onClick={ e => e.stopPropagation() }
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