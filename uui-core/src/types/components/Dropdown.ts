import React from 'react';
import { Modifier } from 'react-popper';
import { Placement, Boundary } from '@popperjs/core';
import { IDropdownBodyProps, IDropdownToggler, IEditable } from '../props';

export interface DropdownBodyProps extends IDropdownBodyProps {}

export type DropdownPlacement = Placement;

export interface DropdownProps extends Partial<IEditable<boolean>> {
    renderTarget: (props: IDropdownToggler) => React.ReactNode;
    renderBody: (props: DropdownBodyProps) => React.ReactNode;
    onClose?: () => void;
    isNotUnfoldable?: boolean;
    zIndex?: number;
    placement?: DropdownPlacement;
    modifiers?: Modifier<any>[];
    /** Should we close dropdown on click on the Toggler, if it's already open? Default is true. */

    /** @default 0 */
    openDelay?: number;
    /** @default 0 */
    closeDelay?: number;
    /**
     * @default true
     */
    openOnClick?: boolean;
    /** @default false */
    openOnHover?: boolean;
    /** @default true */
    closeOnTargetClick?: boolean;
    /** @default true */
    closeOnClickOutside?: boolean;
    /** @default false */
    closeOnMouseLeave?: 'toggler' | 'boundary' | false;

    portalTarget?: HTMLElement;
    boundaryElement?: Boundary;
    /** @default true */
    closeBodyOnTogglerHidden?: boolean; // default: true; Set false if you do not want to hide the dropdown body in case Toggler is out of the viewport
}
