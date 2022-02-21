import * as React from 'react';
import { Placement, Boundary } from '@popperjs/core';
import { Manager, Reference, Popper, PopperChildrenProps } from 'react-popper';
import type { Options } from '@popperjs/core/lib/modifiers/offset';
import { uuiElement, IHasCX, LayoutLayer, IHasChildren, closest, cx, useUuiContext } from '@epam/uui-core';
import { Portal } from './Portal';
import * as css from './Tooltip.scss';

export interface TooltipProps extends IHasCX, IHasChildren {
    content?: any;
    renderContent?(): any;
    placement?: Placement;
    trigger?: 'click' | 'press' | 'hover';
    portalTarget?: HTMLElement;
    offset?: Options['offset'];
    children?: React.ReactNode;
    boundaryElement?: Boundary;
}

export interface TooltipState {
    isOpen: boolean;
}

export function Tooltip(props: TooltipProps) {
    const { uuiLayout } = useUuiContext();
    const layer = React.useRef<LayoutLayer>();
    const node = React.useRef<HTMLElement>();
    const prevNode = React.useRef<HTMLElement>(node.current);
    const prevProps = React.useRef<TooltipProps>(props);
    const [isOpen, setOpen] = React.useState<boolean>(false);

    const mouseEnterHandler = (e: MouseEvent) => setOpen(true);
    const mouseLeaveHandler = (e: MouseEvent) => setOpen(false);
    const mouseUpHandler = (e: Event) => setOpen(false);
    const mouseDownHandler = (e: MouseEvent) => setOpen(!isOpen);
    const mouseClickHandler = (e: MouseEvent) => setOpen(closest((e.target as HTMLElement), node.current) ? !isOpen : false);

    const attachHandlers = (node: HTMLElement | null) => {
        if (!node) return;

        switch (props.trigger) {
            case 'click': {
                node.addEventListener('click', mouseClickHandler);
                break;
            }

            case 'press': {
                node.addEventListener('mousedown', mouseDownHandler);
                node.addEventListener('mouseup', mouseUpHandler);
                break;
            }

            default: {
                node.addEventListener('mouseenter', mouseEnterHandler);
                node.addEventListener('mouseleave', mouseLeaveHandler);
                break;
            }
        }
    };

    const detachHandlers = (node: HTMLElement | null, prevProps: TooltipProps) => {
        if (!node) return;

        switch (prevProps.trigger) {
            case 'click': {
                node.removeEventListener('click', mouseClickHandler);
                break;
            }

            case 'press': {
                node.removeEventListener('mousedown', mouseDownHandler);
                node.removeEventListener('mouseup', mouseUpHandler);
                break;
            }

            default: {
                node.removeEventListener('mouseenter', mouseEnterHandler);
                node.removeEventListener('mouseleave', mouseLeaveHandler);
                break;
            }
        }
    };

    React.useEffect(() => {
        if (node.current && node.current !== prevNode.current || prevProps.current.trigger !== props.trigger) {
            detachHandlers(prevNode.current, prevProps.current);
            attachHandlers(node.current);
        }

        prevNode.current = node.current;
        prevProps.current = props;
    }, [props]);

    React.useEffect(() => {
        layer.current = uuiLayout?.getLayer();

        return () => {
            detachHandlers(node.current, props);
            layer.current && uuiLayout?.releaseLayer(layer.current);
        };
    }, []);

    const renderTooltip = () => (
        <div role="tooltip" aria-hidden={ isTooltipExist() } className={ uuiElement.tooltipBody }>
            { props.content || props.renderContent?.() }
        </div>
    );

    const renderTooltipBody = ({ ref, placement, style, arrowProps, isReferenceHidden }: PopperChildrenProps) => {
        if (isReferenceHidden && isOpen) {
            // Yes, we know that it's hack and we can perform setState in render, but we don't have other way to do it in case
            setTimeout(() => setOpen(false), 0);
            return null;
        }

        return (
            <div
                ref={ ref }
                style={ { ...style, zIndex: layer.current?.zIndex } }
                className={ cx(props.cx, css.container, uuiElement.tooltipContainer, css.tooltipWrapper) }
                data-placement={ placement }
                data-popper-reference-hidden={ isReferenceHidden }
            >
                { renderTooltip() }
                <div ref={ arrowProps.ref } style={ arrowProps.style } className={ uuiElement.tooltipArrow } />
            </div>
        );
    };

    const isTooltipExist = () => !!props.content || !!props.renderContent;

    const getInnerRef = (nodeRef: typeof node.current, callbackRef: React.Ref<typeof node.current>) => {
        if (node.current !== nodeRef) prevNode.current = node.current;
        node.current = nodeRef;
        attachHandlers(node.current);
        (callbackRef as React.RefCallback<typeof nodeRef>)(nodeRef);
    };

    return (
        <Manager>
            <Reference>
                { ({ ref }) => React.Children.map(props.children, (child, idx) => {
                    if (idx > 0 || !React.isValidElement(child)) return child;
                    return React.cloneElement(child, {
                        ref: (node: HTMLElement) => getInnerRef(node, ref),
                    });
                }) }
            </Reference>
            { isTooltipExist() && isOpen && <Portal target={ props.portalTarget }>
                <Popper
                    placement={ props.placement || 'top' }
                    modifiers={ [
                        { name: 'preventOverflow', options: { boundary: props.boundaryElement } },
                        { name: 'offset', options: { offset: props.offset || [0, 12] } },
                        { name: 'computeStyles', options: { gpuAcceleration: false } },
                        { name: 'hide', enabled: true },
                    ] }
                >
                    { renderTooltipBody }
                </Popper>
            </Portal> }
        </Manager>
    );
}