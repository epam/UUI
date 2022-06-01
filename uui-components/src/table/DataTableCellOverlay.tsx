import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { useSelectionParams } from "./useSelectionParams";
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";
import { canCopyByDirection, CopyCheckParams } from "./canCopyByDirection";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange, selectionRange } = useContext(DataTableSelectionContext);
    const { startColumnIndex, startRowIndex } = selectionRange || {};

    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex, columnIndex });

    const canCopy = (currentCoordinates: Pick<CopyCheckParams, 'columnIndex' | 'rowIndex'>) =>
        (!props.canCopyTo || props.canCopyTo(currentCoordinates /* Just Example. The place for contexts of current and start of copying cell */)) && canCopyByDirection({ startColumnIndex, startRowIndex, allowedDirection: props.acceptCopyDirection, ... currentCoordinates });

    const handleCopyingMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isCopying: true });
    };

    const borderClassNames = isSelected && (!selectionRange?.isCopying
        ? cx(
            'uui-selected-cell',
            isTop && 'uui-selected-cell-top',
            isRight && 'uui-selected-cell-right',
            isBottom && 'uui-selected-cell-bottom',
            isLeft && 'uui-selected-cell-left',
        )
        : canCopy({ columnIndex, rowIndex }) && cx(
            'uui-selected-cell',
            (isTop || !canCopy({ columnIndex, rowIndex: rowIndex - 1 })) && 'uui-selected-cell-top',
            (isRight || !canCopy({ columnIndex: columnIndex + 1, rowIndex })) && 'uui-selected-cell-right',
            (isBottom || !canCopy({ columnIndex, rowIndex: rowIndex + 1 })) && 'uui-selected-cell-bottom',
            (isLeft || !canCopy({ columnIndex: columnIndex - 1, rowIndex })) && 'uui-selected-cell-left',
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
                { props.inFocus && !!props.acceptCopyDirection && <div
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