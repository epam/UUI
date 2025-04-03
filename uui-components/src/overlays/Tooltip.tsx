import * as React from 'react';
import { uuiElement, cx, TooltipCoreProps, DropdownBodyProps, IDropdownTogglerProps } from '@epam/uui-core';
import { autoPlacement, Middleware, offset, Placement } from '@floating-ui/react';
import { Dropdown } from './Dropdown';
import { DropdownContainer } from './DropdownContainer';

export interface TooltipProps extends TooltipCoreProps {}

export function Tooltip(props: TooltipProps) {
    const {
        cx: tooltipCX, maxWidth, children, closeOnMouseLeave, rawProps,
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
        offset(props.offset || { mainAxis: 12 }),
    ];

    let placement;

    if (props.placement && props.placement === 'auto') {
        middleware.push(autoPlacement());
    } else {
        placement = props.placement || 'top';
    }

    if (props.placement === 'auto') {
        middleware.push(autoPlacement());
    }

    return (
        <Dropdown
            { ...props }
            renderBody={ (props) => renderTooltip(props) }
            openOnHover={ true }
            closeOnMouseLeave={ closeOnMouseLeave ?? 'toggler' }
            placement={ placement as Placement }
            middleware={ middleware }
            renderTarget={ (props: IDropdownTogglerProps) => renderTarget(props) }
        />
    );
}
