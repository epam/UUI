import * as React from 'react';
import { uuiElement, cx, TooltipCoreProps, DropdownBodyProps, IDropdownTogglerProps } from '@epam/uui-core';
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

    return (
        <Dropdown
            { ...props }
            renderBody={ (props) => renderTooltip(props) }
            openOnHover={ true }
            closeOnMouseLeave={ closeOnMouseLeave ?? 'toggler' }
            placement={ props.placement || 'top' }
            modifiers={ [{ name: 'offset', options: { offset: props.offset || [0, 12] } }] }
            renderTarget={ (props: IDropdownTogglerProps) => renderTarget(props) }
        />
    );
}
