import React from 'react';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import { DropdownProps } from './index';
import { IHasChildren, IHasCX } from '../props';
import { IEditable } from '../../../src/types/props';

export interface TooltipCoreProps
    extends IHasCX,
        IHasChildren,
        Partial<IEditable<boolean>>,
        Pick<
            DropdownProps,
            | 'onClose'
            | 'placement'
            | 'modifiers'
            | 'openDelay'
            | 'closeDelay'
            | 'closeOnMouseLeave'
            | 'portalTarget'
            | 'boundaryElement'
            | 'closeBodyOnTogglerHidden'
        > {
    /** Content to show in the tooltip (ReactNode) */
    content?: any;

    /** Alternative to 'content' prop, you can pass a render function.
     * The function will only be called when content is shown, this can save performance. */
    renderContent?(): any;

    /** Defines when to show the tooltip: 'hover' - default and usual, 'press' - only when mouse button is down, 'manual' - visibility is controlled with isVisible prop  */
    trigger?: 'click' | 'press' | 'hover' | 'manual';

    /** See [Popper docs]{@link https://popper.js.org/docs/v2/modifiers/offset/} */
    offset?: Options['offset'];

    /** React Node(s) to show tooltip for */
    children?: React.ReactNode;

    /** Max width of tooltip */
    maxWidth?: number;
}
