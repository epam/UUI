import React from 'react';
import { OffsetOptions, Placement } from '@floating-ui/react';
import { DropdownProps } from './Dropdown';
import { IHasChildren, IHasCX, IHasRawProps } from '../props';
import { IControlled } from '../props';

export interface TooltipCoreProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    Partial<IControlled<boolean>>, Pick<DropdownProps, 'onClose' | 'middleware' | 'openDelay' |
    'closeDelay' | 'closeOnMouseLeave' | 'portalTarget' | 'boundaryElement' | 'closeBodyOnTogglerHidden'> {
    /** Content to show in the tooltip (ReactNode) */
    content?: any;

    /** Alternative to 'content' prop, you can pass a render function.
     * The function will only be called when content is shown, this can save performance. */
    renderContent?(): any;

    /** See [Floating UI docs]{@link https://floating-ui.com/docs/offset} */
    offset?: OffsetOptions;

    /** React Node(s) to show tooltip for */
    children?: React.ReactNode;

    /** Max width of tooltip */
    maxWidth?: number;

    placement?: Placement | 'auto';
}
