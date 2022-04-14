import * as React from 'react';
import { cx, ICanBeInvalid, IHasCX, uuiMod } from '@epam/uui-core';
import * as css from './DataTableCellOverlay.scss';
import { Manager, Popper, Reference, ReferenceChildrenProps } from 'react-popper';
import { Portal } from '../overlays/Portal';
import { TooltipProps } from '../overlays';

export interface DataTableCellOverlayProps extends IHasCX, ICanBeInvalid {
    hasFocus: boolean;
    renderTooltip?: (props: ICanBeInvalid & TooltipProps) => React.ReactElement;
}

export function DataTableCellOverlay(props: DataTableCellOverlayProps) {
    const overlay = (
        <div
            className={ cx(
                css.root,
                props.isInvalid && uuiMod.invalid,
                props.hasFocus && uuiMod.focus,
                props.cx,
            ) }
        />
    );

    // Wrap and add validation tooltip
    if (props.hasFocus) {
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
};