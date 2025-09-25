import React from 'react';
import { OffsetOptions, Placement } from '@floating-ui/react';
import { DropdownProps } from './Dropdown';
import { IHasChildren, IHasCX, IHasRawProps } from '../props';
import { IControlled } from '../props';

/**
 * @deprecated
 * left for backward compatibility, will be removed in future versions
 */
export type OutdatedOffset = [number | null | undefined, number | null | undefined];

export interface TooltipCoreProps extends IHasCX, IHasChildren, IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
    Partial<IControlled<boolean>>, Pick<DropdownProps, 'onClose' | 'middleware' | 'openDelay' |
    'closeDelay' | 'closeOnMouseLeave' | 'portalTarget' | 'boundaryElement' | 'closeBodyOnTogglerHidden' | 'closeOnEscape'> {
    /** Content to show in the tooltip (ReactNode) */
    content?: any;

    /** Alternative to 'content' prop, you can pass a render function.
     * The function will only be called when content is shown, this can save performance. */
    renderContent?(): any;

    /** See [Floating UI docs]{@link https://floating-ui.com/docs/offset} */
    offset?: OffsetOptions | OutdatedOffset;

    /** React Node(s) to show tooltip for */
    children?: React.ReactNode;

    /** Max width of tooltip */
    maxWidth?: number;

    /**
     * The placement of the floating element relative to the reference element.
     */
    placement?: Placement | 'auto';
}
