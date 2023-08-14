import React from 'react';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import { DropdownProps } from './Dropdown';
import { IHasChildren, IHasCX, IHasRawProps } from '../props';
import { IEditable } from '../props';

export interface TooltipCoreProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    Partial<IEditable<boolean>>, Pick<DropdownProps, 'onClose' | 'placement' | 'modifiers' | 'openDelay' |
    'closeDelay' | 'closeOnMouseLeave' | 'portalTarget' | 'boundaryElement' | 'closeBodyOnTogglerHidden'> {
    /** Content to show in the tooltip (ReactNode) */
    content?: any;

    /** Alternative to 'content' prop, you can pass a render function.
     * The function will only be called when content is shown, this can save performance. */
    renderContent?(): any;

    /** See [Popper docs]{@link https://popper.js.org/docs/v2/modifiers/offset/} */
    offset?: Options['offset'];

    /** React Node(s) to show tooltip for */
    children?: React.ReactNode;

    /** Max width of tooltip */
    maxWidth?: number;
}
