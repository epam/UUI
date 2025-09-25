import * as React from 'react';
import { uuiElement, cx, TooltipCoreProps, DropdownBodyProps, IDropdownTogglerProps, devLogger, OutdatedOffset } from '@epam/uui-core';
import { autoPlacement, Middleware, offset, OffsetOptions, Placement } from '@floating-ui/react';
import { Dropdown } from './Dropdown';
import { DropdownContainer } from './DropdownContainer';

export interface TooltipProps extends TooltipCoreProps {}

function normalizeOffset(offsetValue: OffsetOptions | OutdatedOffset | undefined): OffsetOptions {
    if (!offsetValue) {
        return { mainAxis: 12 };
    }

    // If it's an array (tuple) format, convert to object format
    if (Array.isArray(offsetValue)) {
        // Only show warning in development mode
        if (__DEV__) {
            devLogger.warn(
                '[Tooltip]: The array format [number, number] for `offset` prop is deprecated and will be removed in future versions. '
                + 'Please use object format { mainAxis, crossAxis } instead. '
                + 'See: https://floating-ui.com/docs/offset',
            );
        }

        const [crossAxis = 0, mainAxis = 0] = offsetValue;
        return {
            crossAxis: crossAxis ?? 0,
            mainAxis: mainAxis ?? 0,
        };
    }

    return offsetValue;
}

export function Tooltip(props: TooltipProps) {
    const {
        cx: tooltipCX, maxWidth, children, closeOnMouseLeave, rawProps, closeOnEscape = true,
    } = props;

    const isTooltipExist = () => !!props.content || !!props.renderContent;

    const renderTooltip = (bodyProps: DropdownBodyProps) => {
        if (isTooltipExist()) {
            return (
                <DropdownContainer
                    focusLock={ false }
                    showArrow={ true }
                    maxWidth={ maxWidth ?? 300 }
                    cx={ cx(tooltipCX, uuiElement.tooltipContainer) }
                    { ...bodyProps }
                >
                    <div role="tooltip" aria-hidden={ isTooltipExist() } className={ uuiElement.tooltipBody } { ...rawProps }>
                        {props.content || props.renderContent?.()}
                    </div>
                </DropdownContainer>
            );
        } else {
            return null;
        }
    };

    const renderTarget = (props: IDropdownTogglerProps) =>
        React.Children.map(children, (child, idx) => {
            if (idx > 0 || !React.isValidElement(child)) return child;
            return React.cloneElement<React.ComponentPropsWithRef<any>>(child, { ref: props.ref });
        });

    const middleware: Middleware[] = [
        offset(normalizeOffset(props.offset)),
    ];

    let placement;

    if (props.placement && props.placement === 'auto') {
        middleware.push(autoPlacement());
    } else {
        placement = props.placement || 'top';
    }

    // Merge any custom middleware from props
    const finalMiddleware = props.middleware ? [...middleware, ...props.middleware] : middleware;

    return (
        <Dropdown
            { ...props }
            renderBody={ (props) => renderTooltip(props) }
            openOnHover={ true }
            openOnFocus={ true }
            closeOnMouseLeave={ closeOnMouseLeave ?? 'toggler' }
            placement={ placement as Placement }
            middleware={ finalMiddleware }
            renderTarget={ (props: IDropdownTogglerProps) => renderTarget(props) }
            closeOnEscape={ closeOnEscape }
        />
    );
}
