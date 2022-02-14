import * as React from 'react';
import { Manager, Reference, Popper, ReferenceChildrenProps, PopperChildrenProps, Modifier } from 'react-popper';
import { FreeFocusInside } from 'react-focus-lock';
import { Placement, Boundary } from '@popperjs/core';
import { isClickableChildClicked, IEditable, LayoutLayer, IDropdownToggler, UuiContexts, closest, UuiContext, uuiElement } from '@epam/uui-core';
import { Portal } from './Portal';

export interface DropdownState {
    opened: boolean;
    bodyBoundingRect: { y: number | null; x: number | null, width: number | null, height: number | null };
    closeDropdownTimerId: number;
}

export interface DropdownBodyProps {
    onClose(): void;
    togglerWidth: number;
    togglerHeight: number;
    scheduleUpdate: () => void;
}

export type DropdownPlacement = Placement;

export interface DropdownProps extends Partial<IEditable<boolean>> {
    renderTarget: (props: IDropdownToggler) => React.ReactNode;
    renderBody: (props: DropdownBodyProps) => React.ReactNode;
    onClose?: () => void;
    isNotUnfoldable?: boolean;
    stopCloseSelectors?: string[];
    zIndex?: number;
    placement?: DropdownPlacement;
    modifiers?: Modifier<any>[];
    /** Should we close dropdown on click on the Toggler, if it's already open? Default is true. */

    openOnClick?: boolean; // default: true
    openOnHover?: boolean; // default: false
    closeOnTargetClick?: boolean; // default: true
    closeOnClickOutside?: boolean; // default: true
    closeOnMouseLeave?: 'toggler' | 'boundary' | false;

    portalTarget?: HTMLElement;
    boundaryElement?: Boundary;

    closeBodyOnTogglerHidden?: boolean; // default: true; Set false if you do not want to hide the dropdown body in case Toggler is out of the viewport
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

    state: DropdownState = {
        opened: this.props.value || false,
        bodyBoundingRect: { y: null, x: null, height: null, width: null },
        closeDropdownTimerId: null,
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

        if (this.props.closeOnMouseLeave === 'toggler') {
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
            closeDropdownTimerId: window.setTimeout(() => {
                this.handleOpenedChange(false);
                this.clearCloseDropdownTimer();
            }, 1500),
        });
    }

    clearCloseDropdownTimer() {
        if (this.state.closeDropdownTimerId) {
            clearTimeout(this.state.closeDropdownTimerId);
            this.setState({ closeDropdownTimerId: null });
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
        })
    }

    private renderDropdownBody = ({ ref, placement, style, update, isReferenceHidden }: PopperChildrenProps) => {
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

        if (isReferenceHidden && this.props.closeBodyOnTogglerHidden !== false && (this.state.opened || this.props.value)) {
            // Yes, we know that it's hack and we can perform setState in render, but we don't have other way to do it in this case
            setTimeout(() => this.handleOpenedChange(false), 0);
            return null;
        }

        return (
            <FreeFocusInside>
                <div
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
                    }) }
                </div>
            </FreeFocusInside>
        );
    }

    private isInteractedOutside = (e: Event) => {
        if (!this.isOpened()) return false;

        const target = e.target as HTMLElement;
        const stopNodes = [this.bodyNode, this.targetNode, ...(this.props.stopCloseSelectors || [])];

        if (stopNodes.filter(stopNode => typeof stopNode !== 'string').some(node => node && closest(target, node))) {
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
