import * as React from 'react';
import { cx, DataTableCellOverlayProps, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { TooltipProps } from '../overlays';
import { useSelectionParams } from "./useSelectionParams";

// export interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid {
//     inFocus: boolean;
//     // canReplicating?: boolean;
//     // isReplicating?: boolean;
//     // isSelecting?: boolean;
//     renderTooltip?: (props: ICanBeInvalid & TooltipProps) => React.ReactElement;
// }

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const { isSelected, isTop, isRight, isBottom, isLeft } = useSelectionParams({ rowIndex: props.rowIndex, columnIndex: props.columnIndex });

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
            />
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