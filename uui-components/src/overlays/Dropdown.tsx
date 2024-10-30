import * as React from 'react';
import { Manager, Reference, Popper, ReferenceChildrenProps, PopperChildrenProps } from 'react-popper';
import { FreeFocusInside } from 'react-focus-lock';
import { isEventTargetInsideClickable, LayoutLayer, UuiContexts, UuiContext, DropdownProps } from '@epam/uui-core';
import { Portal } from './Portal';
import { isInteractedOutsideDropdown } from './DropdownHelpers';
import { Placement } from '@popperjs/core';

interface DropdownState {
    opened: boolean;
    bodyBoundingRect: { y: number | null; x: number | null; width: number | null; height: number | null };
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
    private targetNode: HTMLElement | null = null;
    private bodyNode: HTMLElement | null = null;
    private lastOpenedMs: number;
    private togglerWidth: number;
    private togglerHeight: number;
    static contextType = UuiContext;
    public context: UuiContexts;
    private layer: LayoutLayer;
    private openDropdownTimerId: NodeJS.Timeout = null;
    private closeDropdownTimerId: NodeJS.Timeout = null;
    private observer: MutationObserver;

    state: DropdownState = {
        opened: this.props.value || false,
        bodyBoundingRect: {
            y: null, x: null, height: null, width: null,
        },
    };

    constructor(props: DropdownProps) {
        super(props);
    }

    public componentDidMount() {
        this.layer = this.context.uuiLayout?.getLayer();

        window.addEventListener('dragstart', this.clickOutsideHandler);

        if (this.props.openOnHover && !this.props.openOnClick) {
            this.targetNode?.addEventListener?.('mouseenter', this.handleMouseEnter);

            if (this.props.closeOnMouseLeave !== false) {
                this.targetNode?.addEventListener?.('mouseleave', this.handleMouseLeave);
            }
        }

        if (this.props.closeOnClickOutside !== false) {
            window.addEventListener('mousedown', this.clickOutsideHandler, true);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('dragstart', this.clickOutsideHandler);
        this.targetNode?.removeEventListener?.('mouseenter', this.handleMouseEnter);
        this.targetNode?.removeEventListener?.('mouseleave', this.handleMouseLeave);
        window.removeEventListener('mousedown', this.clickOutsideHandler, true);
        window.removeEventListener('mousemove', this.handleMouseMove);
        this.layer && this.context.uuiLayout?.releaseLayer(this.layer);
    }

    handleOpenedChange = (opened: boolean) => {
        if (opened && this.props.closeOnMouseLeave === 'boundary') {
            window.addEventListener('mousemove', this.handleMouseMove);
        } else if (!opened && this.props.closeOnMouseLeave === 'boundary') {
            window.removeEventListener('mousemove', this.handleMouseMove);
        }

        if (this.props.onValueChange) {
            this.props.onValueChange(opened);
        } else {
            this.setState({ opened });
        }

        if (opened) {
            this.lastOpenedMs = new Date().getTime();
        }
    };

    isOpened = () => {
        return this.props.value !== undefined ? this.props.value : this.state.opened;
    };

    private handleTargetClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (!this.props.isNotUnfoldable && !(e && isEventTargetInsideClickable(e))) {
            const currentValue = this.isOpened();
            const newValue = this.props.closeOnTargetClick === false ? true : !currentValue;

            if (currentValue !== newValue) {
                this.handleOpenedChange(newValue);
            }
        }
    };

    private handleMouseEnter = () => {
        this.clearCloseDropdownTimer();
        if (this.props.openDelay) {
            this.setOpenDropdownTimer();
        } else {
            this.handleOpenedChange(true);
        }
    };

    private handleMouseLeave = () => {
        this.clearOpenDropdownTimer();

        if (this.props.closeOnMouseLeave !== 'boundary') {
            // For boundary mode we have separate logic on onMouseMove handler
            if (this.props.closeDelay) {
                this.isOpened() && this.setCloseDropdownTimer(this.props.closeDelay);
            } else {
                this.handleOpenedChange(false);
            }
        }
    };

    isClientInArea(e: MouseEvent) {
        const areaPadding = 30;
        const rect = this.bodyNode?.getBoundingClientRect();

        if (rect) {
            const {
                y, x, height, width,
            } = rect;

            if (y && x && width && height) {
                return x - areaPadding <= e.clientX && e.clientX <= x + areaPadding + width && y - areaPadding <= e.clientY && e.clientY <= y + height + areaPadding;
            }
        }

        return false;
    }

    setOpenDropdownTimer() {
        this.openDropdownTimerId = setTimeout(() => {
            this.handleOpenedChange(true);
            this.clearOpenDropdownTimer();
        }, this.props.openDelay || 0);
    }

    setCloseDropdownTimer(delay: number) {
        this.closeDropdownTimerId = setTimeout(() => {
            this.handleOpenedChange(false);
            this.clearCloseDropdownTimer();
        }, delay);
    }

    clearOpenDropdownTimer() {
        if (this.openDropdownTimerId) {
            clearTimeout(this.openDropdownTimerId);
            this.openDropdownTimerId = null;
        }
    }

    clearCloseDropdownTimer() {
        if (this.closeDropdownTimerId) {
            clearTimeout(this.closeDropdownTimerId);
            this.closeDropdownTimerId = null;
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        if (this.isInteractedOutside(e) && this.isClientInArea(e) && !this.closeDropdownTimerId) {
            // User cursor in boundary area, but not inside toggler or body
            this.clearOpenDropdownTimer();
            this.setCloseDropdownTimer(this.props.closeDelay ?? 1500);
        } else if (this.isInteractedOutside(e) && !this.isClientInArea(e)) {
            // User leave boundary area, close dropdown immediately or with this.props.closeDelay
            if (this.props.closeDelay && !this.closeDropdownTimerId) {
                this.isOpened() && this.setCloseDropdownTimer(this.props.closeDelay);
            } else if (!this.props.closeDelay) {
                this.clearCloseDropdownTimer();
                this.handleOpenedChange(false);
            }
        } else if (!this.isInteractedOutside(e) && this.closeDropdownTimerId) {
            // User returned to the toggler or body area, we need to clear close timer
            this.clearCloseDropdownTimer();
        }
    };

    private onClose = () => {
        if (this.props.onClose) this.props.onClose();
        else this.handleOpenedChange(false);
    };

    private getTargetClickHandler = () => {
        const { openOnClick, openOnHover } = this.props;

        if (
            openOnClick
            || !openOnHover
        ) {
            return this.handleTargetClick;
        }

        return undefined;
    };

    private getIsInteractedOutside = (event: Event) => {
        return isInteractedOutsideDropdown(
            event,
            [
                this.bodyNode,
                this.targetNode,
            ],
        );
    };

    private setForwardedRef = (node: HTMLElement | null) => {
        if (!this.props.forwardedRef) return;

        if (typeof this.props.forwardedRef === 'function') {
            this.props.forwardedRef(node);
        } else {
            this.props.forwardedRef.current = node;
        }
    };

    private getPlacement = (placement: Placement): Placement => {
        if (window.document?.dir === 'rtl') {
            if (!placement) return 'bottom-end';
            return placement.replace('start', 'end') as Placement;
        }
        return placement;
    };

    private renderTarget(targetProps: ReferenceChildrenProps) {
        const innerRef = (node: HTMLElement | null) => {
            if (!node) {
                return;
            }

            this.targetNode = node;
            if (typeof targetProps.ref === 'function') {
                targetProps.ref(this.targetNode);
            } else if (targetProps.ref) {
                (targetProps.ref as React.MutableRefObject<HTMLElement>).current = this.targetNode;
            }

            this.setForwardedRef(this.targetNode);
        };

        return this.props.renderTarget({
            onClick: this.getTargetClickHandler(),
            isOpen: this.isOpened(),
            isDropdown: true,
            ref: innerRef,
            toggleDropdownOpening: this.handleOpenedChange,
            isInteractedOutside: this.getIsInteractedOutside,
        });
    }

    private renderDropdownBody = ({
        ref, placement, style, update, isReferenceHidden, arrowProps,
    }: PopperChildrenProps) => {
        const setRef = (node: HTMLElement) => {
            (ref as React.RefCallback<HTMLElement>)(node);
            this.bodyNode = node;
        };

        if (isReferenceHidden && this.props.closeBodyOnTogglerHidden !== false && this.isOpened()) {
            // Yes, we know that it's hack and we can perform setState in render, but we don't have other way to do it in this case
            setTimeout(() => this.handleOpenedChange(false), 0);
            return null;
        }

        // @ts-ignore
        return (
            <FreeFocusInside>
                <div
                    role="dialog"
                    className="uui-popper"
                    aria-hidden={ !this.isOpened() }
                    ref={ setRef }
                    style={ { ...style, zIndex: this.props.zIndex != null ? this.props.zIndex : this.layer?.zIndex } }
                    data-placement={ this.getPlacement(placement) }
                >
                    {this.props.renderBody({
                        onClose: this.onClose,
                        togglerWidth: this.togglerWidth,
                        togglerHeight: this.togglerHeight,
                        scheduleUpdate: update,
                        isOpen: this.isOpened(),
                        arrowProps: arrowProps,
                        placement: this.getPlacement(placement),
                    })}
                </div>
            </FreeFocusInside>
        );
    };

    private isInteractedOutside = (e: Event) => {
        if (!this.isOpened()) return false;
        return this.getIsInteractedOutside(e);
    };

    private clickOutsideHandler = (e: Event) => {
        if (this.isInteractedOutside(e)) {
            this.handleOpenedChange(false);
        }
    };

    private updateTogglerSize() {
        if (this.targetNode) {
            const { width, height } = this.targetNode.getBoundingClientRect();
            this.togglerWidth = width;
            this.togglerHeight = height;
        }
    }

    public render() {
        const shouldShowBody = this.isOpened() && !this.props.isNotUnfoldable;
        const defaultModifiers = [
            {
                name: 'preventOverflow',
                options: {
                    rootBoundary: 'viewport',
                    boundary: this.props.boundaryElement,
                },
            }, {
                name: 'hide',
                enabled: true,
            },
        ];

        if (shouldShowBody) {
            this.updateTogglerSize();
        }

        return (
            <Manager>
                <Reference>{(targetProps) => this.renderTarget(targetProps)}</Reference>
                {shouldShowBody && (
                    <Portal target={ this.props.portalTarget }>
                        <Popper placement={ this.getPlacement(this.props.placement) || 'bottom-start' } strategy="fixed" modifiers={ [...defaultModifiers, ...(this.props.modifiers || [])] }>
                            {this.renderDropdownBody}
                        </Popper>
                    </Portal>
                )}
            </Manager>
        );
    }
}
