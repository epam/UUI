import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { TooltipProps } from '../overlays';
import { useSelectionParams } from "./useSelectionParams";
import { PointerEventHandler, useContext } from "react";
import { DataTableSelectionContext } from "./DataTableSelectionContext";
import { canReplicateByDirection, CopyCheckParams } from "./canReplicateByDirection";

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { columnIndex, rowIndex } = props;
    const { setSelectionRange, selectionRange } = useContext(DataTableSelectionContext);
    const { startColumnIndex, startRowIndex } = selectionRange || {};

    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex, columnIndex });

    const canCopy = (currentCoordinates: Pick<CopyCheckParams, 'columnIndex' | 'rowIndex'>) =>
        (!props.canCopyTo || props.canCopyTo(null /* The place for contexts of current and start of copying cell */)) && canReplicateByDirection({ startColumnIndex, startRowIndex, allowedDirection: props.acceptReplication, ...currentCoordinates });

    const handleReplicationMarkerPointerDown: PointerEventHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setSelectionRange({ startColumnIndex: columnIndex, startRowIndex: rowIndex, endColumnIndex: columnIndex, endRowIndex: rowIndex, isReplicating: true });
    };

    const borderClassNames = isSelected && (!selectionRange?.isReplicating
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
            { props.inFocus && !!props.acceptReplication && <div
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