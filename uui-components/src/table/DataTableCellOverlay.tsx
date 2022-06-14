import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiDataTableCell, uuiMod } from '@epam/uui-core';
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
            css.selected,
            isTop && css.top,
            isRight && css.right,
            isBottom && css.bottom,
            isLeft && css.left,
        )
        : canCopy({ columnIndex, rowIndex }) && cx(
            css.selected,
            (isTop || !canCopy({ columnIndex, rowIndex: rowIndex - 1 })) && css.top,
            (isRight || !canCopy({ columnIndex: columnIndex + 1, rowIndex })) && css.right,
            (isBottom || !canCopy({ columnIndex, rowIndex: rowIndex + 1 })) && css.bottom,
            (isLeft || !canCopy({ columnIndex: columnIndex - 1, rowIndex })) && css.left,
        ));

    const overlay = (
            <div
                className={ cx(
                    css.root,
                    props.isInvalid && uuiMod.invalid,
                    props.inFocus && uuiMod.focus,
                    props.cx,
                    borderClassNames,
                    uuiDataTableCell.uuiTableCellOverlay,
                ) }
            >
                { props.inFocus && !!props.acceptCopyDirection && <div
                    className={ cx(css.copyingMarker, uuiDataTableCell.uuiTableCellCopyingMarker) }
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