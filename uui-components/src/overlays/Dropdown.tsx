import * as React from 'react';
import { Manager, Reference, Popper, ReferenceChildrenProps, PopperChildrenProps } from 'react-popper';
import { FreeFocusInside } from 'react-focus-lock';
import { isClickableChildClicked, LayoutLayer, UuiContexts, UuiContext, closest, DropdownProps, DropdownState } from '@epam/uui-core';
import { Portal } from './Portal';

const isInteractedOutsideDropdown = (e: Event, stopNodes: HTMLElement[]) => {
    const [relatedNode] = stopNodes;
    const target = e.target as HTMLElement;

    if (stopNodes.some(node => node && closest(target, node))) {
        return false;
    }

    return !(closest(target, '.uui-popper') && +closest(target, '.uui-popper').style.zIndex > (relatedNode !== null ? +relatedNode.style.zIndex : 0));
};

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

    state: DropdownState = {
        opened: this.props.value || false,
        bodyBoundingRect: { y: null, x: null, height: null, width: null },
    };

    constructor(props: DropdownProps) {
        super(props);
    }

    public componentDidMount() {
        this.layer = this.context.uuiLayout?.getLayer();

        window.addEventListener('dragstart', this.clickOutsideHandler);

        if (this.props.openOnHover && !this.props.openOnClick) {
            this.targetNode?.addEventListener?.('mouseenter', this.handleMouseEnter);
        }

        if (this.props.closeOnMouseLeave) {
            this.targetNode?.addEventListener?.('mouseleave', this.handleMouseLeave);
        }

        if (this.props.closeOnClickOutside !== false) {
            window.addEventListener('click', this.clickOutsideHandler, true);
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('dragstart', this.clickOutsideHandler);
        window.removeEventListener('click', this.clickOutsideHandler, true);
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
    }

    isOpened = () => {
        return this.props.value !== undefined ? this.props.value : this.state.opened;
    }

    private handleTargetClick = (e: React.SyntheticEvent<HTMLElement>) => {
        if (!this.props.isNotUnfoldable && !(e && isClickableChildClicked(e))) {
            const currentValue = this.isOpened();
            const newValue = (this.props.closeOnTargetClick === false) ? true : !currentValue;

            if (currentValue !== newValue) {
                this.handleOpenedChange(newValue);
            }
        }
    }

    private handleMouseEnter = (e: Event) => {
        this.clearCloseDropdownTimer();
        if (this.props.openDelay) {
            this.setOpenDropdownTimer();
        } else {
            this.handleOpenedChange(true);
        }
    }

    private handleMouseLeave = (e: MouseEvent) => {
        this.clearOpenDropdownTimer();

        if (this.props.closeOnMouseLeave !== 'boundary') { // For boundary mode we have separate logic on onMouseMove handler
            if (this.props.closeDelay) {
                this.isOpened() && this.setCloseDropdownTimer(this.props.closeDelay);
            } else {
                this.handleOpenedChange(false);
            }
        }
    }

    isClientInArea(e: MouseEvent) {
        const areaPadding = 30;
        const { y, x, height, width } = this.state.bodyBoundingRect;

        if (y && x && width && height) {
            return x - areaPadding <= e.clientX && e.clientX <= x + areaPadding + width && y - areaPadding <= e.clientY && e.clientY <= y + height + areaPadding;
        }
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
        if (this.isInteractedOutside(e) && !this.isClientInArea(e)) { // User leave boundary area, close dropdown immediately or with this.props.closeDelay
            this.clearCloseDropdownTimer();
            this.clearOpenDropdownTimer();

            if (this.props.closeDelay) {
                this.isOpened() && this.setCloseDropdownTimer(this.props.closeDelay);
            } else {
                this.handleOpenedChange(false);
            }
        } else if (this.isInteractedOutside(e) && !this.closeDropdownTimerId) { // User cursor in boundary area, but not inside toggler or body
            this.setCloseDropdownTimer(this.props.closeDelay ?? 1500);
        } else if (!this.isInteractedOutside(e) && this.closeDropdownTimerId) { // User returned to the toggler or body area, we need to clear close timer
            this.clearCloseDropdownTimer();
        }
    }

    private onClose = () => {
        if (this.props.onClose) this.props.onClose();
        else this.handleOpenedChange(false);
    }

    private renderTarget(targetProps: ReferenceChildrenProps) {
        const { openOnClick, openOnHover } = this.props;
        const handleTargetClick =  (openOnClick || (!openOnClick && !openOnHover)) ? this.handleTargetClick : undefined;
        const innerRef = (node: HTMLElement | null) => {
            if (!node) return;
            this.targetNode = node;
            (targetProps.ref as React.RefCallback<HTMLElement>)(this.targetNode);
        };

        return this.props.renderTarget({
            onClick: handleTargetClick,
            isOpen: this.isOpened(),
            isDropdown: true,
            ref: innerRef,
            toggleDropdownOpening: this.handleOpenedChange,
            isInteractedOutside: (e) => isInteractedOutsideDropdown(e, [this.bodyNode, this.targetNode]),
        });
    }

    private renderDropdownBody = ({ ref, placement, style, update, isReferenceHidden, arrowProps }: PopperChildrenProps) => {
        const setRef = (node: HTMLElement) => {
            (ref as React.RefCallback<HTMLElement>)(node);
            this.bodyNode = node;
            if (this.bodyNode && this.props.closeOnMouseLeave === 'boundary') {
                const { x, y, height, width } = this.bodyNode.getBoundingClientRect();
                if (x && y && !this.state.bodyBoundingRect.y && !this.state.bodyBoundingRect.x) {
                    this.setState({ bodyBoundingRect : { y, height, width, x } });
                }
            }
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
                    className='uui-popper'
                    aria-hidden={ !this.isOpened() }
                    aria-expanded={ this.isOpened() }
                    ref={ setRef }
                    style={ { ...style, zIndex: this.props.zIndex != null ? this.props.zIndex : this.layer?.zIndex } }
                    data-placement={ placement }
                >
                    { this.props.renderBody({
                        onClose: this.onClose,
                        togglerWidth: this.togglerWidth,
                        togglerHeight: this.togglerHeight,
                        scheduleUpdate: update,
                        isOpen: this.isOpened(),
                        arrowProps: arrowProps,
                        placement: placement,
                    }) }
                </div>

            </FreeFocusInside>
        );
    }

    private isInteractedOutside = (e: Event) => {
        if (!this.isOpened()) return false;
        return isInteractedOutsideDropdown(e, [this.bodyNode, this.targetNode]);
    }

    private clickOutsideHandler = (e: Event) => {
        if (this.isInteractedOutside(e)) {
            this.handleOpenedChange(false);
        }
    }

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
            },
            {
                name: 'hide',
                enabled: true,
            },
        ];

        if (shouldShowBody) {
            this.updateTogglerSize();
        }

        return (
            <Manager>
                <Reference>
                    { targetProps => this.renderTarget(targetProps) }
                </Reference>
                { shouldShowBody && (
                    <Portal target={ this.props.portalTarget }>
                        <Popper
                            placement={ this.props.placement || 'bottom-start' }
                            strategy={ 'fixed' }
                            modifiers={ [...defaultModifiers, ...(this.props.modifiers || [])] }
                        >
                            { this.renderDropdownBody }
                        </Popper>
                    </Portal>
                ) }
            </Manager>
        );
    }
}
