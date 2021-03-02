import * as React from 'react';
import * as reactDom from 'react-dom';
import cx from 'classnames';
import * as css from './Tooltip.scss';
import {Manager, Reference, Popper} from 'react-popper';
import PopperJS, {Boundary} from "popper.js";
import { uuiElement, IHasCX, LayoutLayer, IHasChildren, UuiContexts, closest } from '@epam/uui';
import { PopperTargetWrapper } from './PopperTargetWrapper';
import { Portal } from './Portal';
import * as PropTypes from 'prop-types';

export interface TooltipProps extends IHasCX, IHasChildren {
    content?: any;
    renderContent?(): any;
    placement?: PopperJS.Placement;
    trigger?: 'click' | 'press' | 'hover';
    portalTarget?: HTMLElement;
    offset?: string;
    children?: React.ReactNode;
    boundaryElement?: Boundary | Element;
}

export interface TooltipState {
    isOpen: boolean;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
    static contextTypes = {
        uuiLayout: PropTypes.object,
    };

    private readonly layer: LayoutLayer | null = null;
    private node: any = null;

    constructor(props: TooltipProps, public context: UuiContexts) {
        super(props, context);
        this.state = { isOpen: false };
        this.layer = this.context.uuiLayout && this.context.uuiLayout.getLayer();
    }

    mouseEnterHandler = (e: MouseEvent) => {
        this.setState({ isOpen: true });
    }
    mouseLeaveHandler = (e: MouseEvent) => {
        this.setState({ isOpen: false });
    }
    mouseDownHandler = (e: MouseEvent) => {
        this.setState({ isOpen: !this.state.isOpen });
    }
    mouseClickHandler = (e: MouseEvent) => {
        if (closest((e.target as HTMLElement), this.node)) {
            this.setState({ isOpen: !this.state.isOpen });
        } else {
            this.setState({ isOpen: false });
        }
    }
    mouseUpHandler = (e: Event) => {
        this.setState({ isOpen: false });
    }

    getNode() {
        return reactDom.findDOMNode(this) as HTMLElement;
    }

    attachHandlers(node: HTMLElement) {
        switch (this.props.trigger) {
            case 'click': {
                node?.addEventListener('click', this.mouseClickHandler);
                break;
            }
            case 'press': {
                node?.addEventListener('mousedown', this.mouseDownHandler);
                node?.addEventListener('mouseup', this.mouseUpHandler);
                break;
            }
            default: {
                node?.addEventListener('mouseenter', this.mouseEnterHandler);
                node?.addEventListener('mouseleave', this.mouseLeaveHandler);
                break;
            }
        }
    }

    detachHandlers(node: HTMLElement, prevProps: TooltipProps) {
        switch (prevProps.trigger) {
            case 'click': {
                node?.removeEventListener('click', this.mouseClickHandler);
                break;
            }
            case 'press': {
                node?.removeEventListener('mousedown', this.mouseDownHandler);
                node?.removeEventListener('mouseup', this.mouseUpHandler);
                break;
            }
            default: {
                node?.removeEventListener('mouseenter', this.mouseEnterHandler);
                node?.removeEventListener('mouseleave', this.mouseLeaveHandler);
                break;
            }
        }
    }

    componentDidMount() {
        this.node = this.getNode();
        this.attachHandlers(this.node);
    }

    componentDidUpdate(prevProps: TooltipProps): void {
        const newNode = this.getNode();
        if (this.node !== this.getNode() || prevProps.trigger !== this.props.trigger) {
            this.detachHandlers(this.node, prevProps);
            this.attachHandlers(newNode);
            this.node = newNode;
        }
    }

    componentWillUnmount() {
        this.node = this.getNode();
        this.detachHandlers(this.node, this.props);

        this.context.uuiLayout && this.layer && this.context.uuiLayout.releaseLayer(this.layer);
    }

    private renderTooltip() {
        const content = this.props.content || (this.props.renderContent && this.props.renderContent());

        return <div className={ uuiElement.tooltipBody }>
            { content }
        </div>;
    }

    render() {
        let hasTooltip = !!this.props.content || !!this.props.renderContent;
        return (
            <Manager>
                <Reference>
                    { ({ref}) => <PopperTargetWrapper innerRef={ ref }>{ this.props.children }</PopperTargetWrapper> }
                </Reference>
                { hasTooltip && this.state.isOpen && <Portal target={ this.props.portalTarget }>
                    <Popper
                        modifiers={ { preventOverflow: { boundariesElement: this.props.boundaryElement || 'window' }, offset: { offset: this.props.offset || '0,12', enabled: true }, computeStyle: { gpuAcceleration: false }  } }
                        placement={ this.props.placement || 'top' }
                    >
                        { ({ ref, style, placement, arrowProps }) => (
                            <div
                                ref={ ref }
                                style={ { ...style, zIndex: this.layer?.zIndex } }
                                className={ cx(this.props.cx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                                data-placement={ placement }
                            >
                                { this.renderTooltip() }
                                <div ref={ arrowProps.ref } style={ arrowProps.style } className={ uuiElement.tooltipArrow } />
                            </div>
                        ) }
                    </Popper>
                </Portal> }
            </Manager>
        );
    }
}