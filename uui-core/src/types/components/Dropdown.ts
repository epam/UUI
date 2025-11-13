import React from 'react';
import { Placement, Boundary, Middleware, VirtualElement } from '@floating-ui/react';
import { IDropdownTogglerProps, IDropdownBodyProps, IControlled } from '../props';

export interface DropdownBodyProps extends IDropdownBodyProps {}

export type DropdownPlacement = Placement;

export interface DropdownProps extends Partial<IControlled<boolean>> {
    /**
     * Render callback for the dropdown target.
     * Note, that it's required to pass 'props' parameters to the target component.
     */
    renderTarget?: (props: IDropdownTogglerProps) => React.ReactNode;
    /** Virtual element is a plain object, which mimics a real element. See [Floating UI docs]{@link https://floating-ui.com/docs/virtual-elements} */
    virtualTarget?: VirtualElement;
    /** Render callback for the dropdown body */
    renderBody: (props: DropdownBodyProps) => React.ReactNode;
    /** Call to close the overlay content */
    onClose?: () => void;
    /** Disable overlay opening */
    isNotUnfoldable?: boolean;
    /** zIndex for overlay content
     * By default used value received by LayoutContext
     * */
    zIndex?: number;
    /** Defines overlay content placement relative to target */
    placement?: DropdownPlacement;
    /** Defines an array of middleware objects that change the positioning of the overlay content. See [Floating UI docs]{@link https://floating-ui.com/docs/middleware}  */
    middleware?: Middleware[];
    /** Defines how much 'ms' user should hold mouse over target to open the overlay
     * This prop work only with openOnHover={true}
     * @default 0
     * */
    openDelay?: number;
    /** Defines after which delay overlay will be closed, if user leave mouse from target.
     * This prop work only with openOnHover={true}
     * @default 0
     * */
    closeDelay?: number;
    /** If true, overlay will be opened by click on target element.
     * @default true
     * */
    openOnClick?: boolean;
    /** If true, overlay will be opened by hover on target element.
     * @default false
     * */
    openOnHover?: boolean;
    /** If true, overlay will be opened by focus on target element.
     * @default false
     * */
    openOnFocus?: boolean;
    /** If true, clicks on target will toggle overlay open state.
     * If false, click on target will only open overlay and won't close it.
     * @default true
     * */
    closeOnTargetClick?: boolean;
    /** If true, overlay will be closed on click outside content or target element.
     * @default true
     * */
    closeOnClickOutside?: boolean;
    /** Defined when to close overlay in case of openOnHover={ true }
     * toggler — overlay will be closed when a mouse leaves the target component
     * boundary — will not immediately close the overlay when the mouse is within 30px around of the content area
     * false — will not close overlay by mouse move event
     * @default 'toggler'
     * */
    closeOnMouseLeave?: 'toggler' | 'boundary' | false;
    /**
     * Node of portal target, where to render the overlay content.
     * By default, will be used global portal node.
     * */
    portalTarget?: HTMLElement;
    /**
     * Element relative to which overlay will calculate position
     * */
    boundaryElement?: Boundary;
    /** Pass false, if you do not want to close the overlay in case target element move out of viewport.
     * @default true
     * */
    closeBodyOnTogglerHidden?: boolean;
    /** Pass false, if you do not want to close the overlay when the Escape key is pressed.
     * @default true
     * */
    closeOnEscape?: boolean;
    /**
     * If true, dropdown will always follow the toggler (pinned). If false, dropdown will stay at the position where it was first opened (static).
     * @default true
     */
    pinToToggler?: boolean;
}
