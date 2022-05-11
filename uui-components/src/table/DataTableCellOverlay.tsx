import * as React from 'react';
import { cx, ICanBeInvalid, IHasCX, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { TooltipProps } from '../overlays';

export interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid {
    inFocus: boolean;
    renderTooltip?: (props: ICanBeInvalid & TooltipProps) => React.ReactElement;
}

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const overlay = (
        <div
            className={ cx(
                css.root,
                props.isInvalid && uuiMod.invalid,
                props.inFocus && uuiMod.focus,
                props.cx,
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