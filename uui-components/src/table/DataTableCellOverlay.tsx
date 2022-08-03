import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod, uuiDataTableCell } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { useSelectionParams } from "./useSelectionParams";
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange } = useContext(DataTableSelectionContext);

    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex, columnIndex });

    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const borderClassNames = isSelected && cx(
        uuiMod.selected,
        isTop && css.top,
        isRight && css.right,
        isBottom && css.bottom,
        isLeft && css.left,
    );

    const overlay = (
            <div
                className={ cx(
                    props.isInvalid && uuiMod.invalid,
                    props.inFocus && uuiMod.focus,
                    props.cx,
                    borderClassNames,
                    uuiDataTableCell.uuiTableCellOverlay,
                ) }
            >
                { props.inFocus && props.allowCopy && <div
                    className={  uuiDataTableCell.uuiTableCellCopyingMarker }
                    onPointerDown={ handleCopyingMarkerPointerDown } onClick={ e => e.stopPropagation() }
                /> }
            </div>
    );

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