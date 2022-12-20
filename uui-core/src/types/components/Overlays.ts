import { IHasChildren, IHasCX } from "../props";
import { Placement, Boundary } from '@popperjs/core';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import React from "react";

export interface TooltipCoreProps extends IHasCX, IHasChildren {
    /** Content to show in the tooltip (ReactNode) */
    content?: any;

    /** Alternative to 'content' prop, you can pass a render function.
     * The function will only be called when content is shown, this can save performance. */
    renderContent?(): any;

    /** Tooltip position relative to the wrapped content. See [Popper Docs](@link https://popper.js.org/) */
    placement?: Placement;

    /** Defines when to show the tooltip: 'hover' - default and usual, 'press' - only when mouse button is down, 'manual' - visibility is controlled with isVisible prop  */
    trigger?: 'click' | 'press' | 'hover' | 'manual';

    /** Is tooltip visible (for trigger='manual') */
    isVisible?: boolean;

    /** Overrides React Portal target to use */
    portalTarget?: HTMLElement;

    /** See [Popper docs]{@link https://popper.js.org/docs/v2/modifiers/offset/} */
    offset?: Options['offset'];

    /** React Node(s) to show tooltip for */
    children?: React.ReactNode;

    /** See  [Popper docs]{@link https://popper.js.org/docs/v2/modifiers/prevent-overflow/} */
    boundaryElement?: Boundary;

    /** Max width of tooltip */
    maxWidth?: string;

    /** Set time delay for open tooltip */
    delay?: number;
}