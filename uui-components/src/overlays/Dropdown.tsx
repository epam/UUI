import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Reference, Popper, ReferenceChildrenProps } from 'react-popper';
import { Portal } from './Portal';
import { isClickableChildClicked, IEditable, LayoutLayer, IDropdownToggler, UuiContexts, closest } from '@epam/uui';
import * as PopperJS from 'popper.js';
import * as PropTypes from 'prop-types';
import { Ref } from "react";
import { PopperTargetWrapper } from "./PopperTargetWrapper";

export interface DropdownState {
    opened: boolean;
    bodyBoundingRect: { y: number | null; x: number | null, width: number | null, height: number | null };
    closeDropdownTimerId: any;
}

export interface DropdownBodyProps {
    onClose(): void;
    togglerWidth: number;
    togglerHeight: number;
    scheduleUpdate: () => void;
}

export type DropdownPlacement = PopperJS.Placement;

export interface DropdownProps extends Partial<IEditable<boolean>> {
    renderTarget: (props: IDropdownToggler & {ref?: Ref<any>}) => React.ReactNode;
    renderBody: (props: DropdownBodyProps & any) => React.ReactNode;
    onClose?: () => any;
    isNotUnfoldable?: boolean;
    stopCloseSelectors?: string[];
    zIndex?: number;
    placement?: DropdownPlacement;
    modifiers?: PopperJS.Modifiers;
    /** Should we close dropdown on click on the Toggler, if it's already open? Default is true. */

    openOnClick?: boolean; // default: true
    openOnHover?: boolean; // default: false
    closeOnTargetClick?: boolean; // default: true
    closeOnClickOutside?: boolean; // default: true
    closeOnMouseLeave?: 'toggler' | 'boundary' | false;

    portalTarget?: HTMLElement;
    boundaryElement?: PopperJS.Boundary | Element;
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
    private targetNode: HTMLElement | null = null;
    private bodyNode: HTMLElement | null = null;
    private lastOpenedMs: number;
    private togglerWidth: number;
    private togglerHeight: number;

    state: DropdownState = {
        opened: this.props.value || false,
        bodyBoundingRect: { y: null, x: null, height: null, width: null },
        closeDropdownTimerId: null,
    };

    static contextTypes = {
        uuiLayout: PropTypes.object,
    };

    private readonly layer: LayoutLayer | null = null;

    constructor(props: DropdownProps, public context: UuiContexts) {
        super(props, context);
        this.layer = this.context.uuiLayout && this.context.uuiLayout.getLayer();
    }

    public componentDidMount() {
        window.addEventListener('dragstart', this.clickOutsideHandler);
        window.addEventListener('scroll', this.clickOutsideHandler, true);

        if (this.props.openOnHover && !this.props.openOnClick) {
            this.targetNode?.addEventListener('mouseenter', this.handleMouseEnter);
        }
        if (this.props.closeOnMouseLeave === 'toggler') {
            this.targetNode?.addEventListener('mouseleave', this.handleMouseLeave);
        }
        if (this.props.closeOnClickOutside !== false) {
            window.addEventListener('click', this.clickOutsideHandler, true);
        }

    }

    public componentWillUnmount() {
        window.removeEventListener('dragstart', this.clickOutsideHandler);
        window.removeEventListener('scroll', this.clickOutsideHandler, true);
        window.removeEventListener('click', this.clickOutsideHandler, true);

        this.context.uuiLayout?.releaseLayer(this.layer);
    }

    handleOpenedChange = (opened: boolean) => {
        if (opened && this.props.closeOnMouseLeave === 'boundary') {
            window.addEventListener('mousemove', this.handleMouseMove);
        } else if (!opened && this.props.closeOnMouseLeave === 'boundary') {
            window.removeEventListener('mousemove', this.handleMouseMove);
        }

        this.props.onValueChange ? this.props.onValueChange(opened) : this.setState({ opened: opened });
        if (opened) {
            this.lastOpenedMs = (new Date()).getTime();
        }
    }

    isOpened = () => {
        return this.props.value !== undefined ? this.props.value : this.state.opened;
    }

    private handleTargetClick = (e: Event) => {
        if (!this.props.isNotUnfoldable && !(e && isClickableChildClicked(e as any))) {
            const currentValue = this.props.value !== undefined ? this.props.value : this.state.opened;
            const newValue = (this.props.closeOnTargetClick === false) ? true : !currentValue;
            if (currentValue !== newValue) {
                this.handleOpenedChange(newValue);
            }
        }
    }

    private handleMouseEnter = (e: Event) => {
        this.handleOpenedChange(true);
    }

    private handleMouseLeave = (e: MouseEvent) => {
        this.handleOpenedChange(false);
    }

    isClientInArea(e: MouseEvent) {
        const areaPadding = 30;
        const { y, x, height, width } = this.state.bodyBoundingRect;

        if (y && x && width && height) {
            return x - areaPadding <= e.clientX && e.clientX <= x + areaPadding + width && y - areaPadding <= e.clientY && e.clientY <= y + height + areaPadding;
        }
    }

    setCloseDropdownTimer() {
        this.setState({
            closeDropdownTimerId: setTimeout(() => { this.handleOpenedChange(false); this.clearCloseDropdownTimer(); }, 1500),
        });
    }

    clearCloseDropdownTimer() {
        if (this.state.closeDropdownTimerId) {
            clearTimeout(this.state.closeDropdownTimerId);
            this.setState({closeDropdownTimerId: null});
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.isInteractedOutside(e) && !this.isClientInArea(e)) {
            this.handleOpenedChange(false);
            this.clearCloseDropdownTimer();
        } else if (this.isInteractedOutside(e) && !this.state.closeDropdownTimerId) {
            this.setCloseDropdownTimer();
        } else if (!this.isInteractedOutside(e) && this.state.closeDropdownTimerId) {
            this.clearCloseDropdownTimer();
        }
    }

    private onClose = () => {
        this.props.onClose ? this.props.onClose() : this.setState({ opened: false });
    }

    private renderTarget(targetProps: ReferenceChildrenProps) {
        const innerRef = (node: Element) => {
            this.targetNode = ReactDOM.findDOMNode(node) as HTMLElement;
            targetProps.ref(this.targetNode);
        };

        return (
            <PopperTargetWrapper innerRef={ innerRef }>
            {
                this.props.renderTarget({
                    onClick: (this.props.openOnClick || (!this.props.openOnClick && !this.props.openOnHover)) ? this.handleTargetClick : undefined,
                    isOpen: this.isOpened(),
                    isDropdown: true,
                })
            }
            </PopperTargetWrapper>
        );
    }

    private isInteractedOutside = (e: Event) => {
        if (!this.isOpened()) {
            return false;
        }

        // Opening the dropdown often cause Search control inside to auto-focus
        // That's (for not investigated reason) causes onScroll event on window,
        //   which in turn cause the dropdown to close immediately after opening
        // This hack prevents this
        // This hack also fixes scroll event on mobile when focus on input
        if (e.type === 'scroll' && ((new Date()).getTime() - this.lastOpenedMs) < 1000) {
            return false;
        }

        const target = (e.target as HTMLElement);
        const stopNodes = [this.bodyNode, this.targetNode, ...(this.props.stopCloseSelectors || [])];

        if (stopNodes.some((node: any) => node && closest(target, node))) {
            return false;
        }

        if (closest(target, '.uui-popper') && +closest(target, '.uui-popper').style.zIndex > (this.bodyNode !== null ? +this.bodyNode.style.zIndex : 0)) {
            return false;
        }

        return true;
    }

    private clickOutsideHandler = (e: Event) => {
        if (this.isInteractedOutside(e)) {
            this.handleOpenedChange(false);
        }
    }

    private updateTogglerSize() {
        if (this.targetNode) {
            const rect = this.targetNode.getBoundingClientRect();
            this.togglerWidth = rect.width;
            this.togglerHeight = rect.height;
        }
    }

    public render() {
        const shouldShowBody = this.isOpened() && !this.props.isNotUnfoldable;

        if (shouldShowBody) {
            this.updateTogglerSize();
        }

        return (
            <Manager>
                <Reference>
                    { (targetProps: ReferenceChildrenProps) => this.renderTarget(targetProps) }
                </Reference>
                { shouldShowBody && <Portal target={ this.props.portalTarget }>
                    <Popper
                        placement={ this.props.placement || 'bottom-start' }
                        positionFixed={ true }
                        modifiers={ {
                            ...this.props.modifiers,
                            preventOverflow: {
                                boundariesElement: this.props.boundaryElement || 'viewport',
                                ...((this.props.modifiers || {}).preventOverflow || {}),
                            },
                        } }
                    >
                        { ({ ref, style, placement, scheduleUpdate }) =>
                            <div
                                className='uui-popper'
                                ref={ node => {
                                    ref(node);
                                    this.bodyNode = node;
                                    if (this.bodyNode && this.props.closeOnMouseLeave === 'boundary') {
                                        const { x, y, height, width } = this.bodyNode.getBoundingClientRect() as DOMRect;
                                        if (x && y && !this.state.bodyBoundingRect.y && !this.state.bodyBoundingRect.x) {
                                            this.setState({ bodyBoundingRect : { y, height, width, x } });
                                        }
                                    }
                                } }
                                style={ { ...style, zIndex: this.props.zIndex != null ? this.props.zIndex : this.layer?.zIndex } }
                                data-placement={ placement }
                            >
                                { this.props.renderBody({
                                    onClose: this.onClose,
                                    togglerWidth: this.togglerWidth,
                                    togglerHeight: this.togglerHeight,
                                    scheduleUpdate,
                                }) }
                            </div>
                        }
                    </Popper>
                </Portal> }
            </Manager>
        );
    }

}
