import * as React from 'react';
import { IDropdownToggler, uuiElement, cx, TooltipCoreProps, DropdownBodyProps } from '@epam/uui-core';
import { Dropdown } from './Dropdown';
import { DropdownContainer } from './DropdownContainer';

export interface TooltipState {
    isOpen: boolean;
}

export interface TooltipProps extends TooltipCoreProps {}

export function Tooltip(props: TooltipProps) {
    const {
        cx: tooltipCX, maxWidth, children, closeOnMouseLeave, rawProps,
    } = props;

    const isTooltipExist = () => !!props.content || !!props.renderContent;

    const renderTooltip = () => (
        <div role="tooltip" aria-hidden={ isTooltipExist() } className={ uuiElement.tooltipBody } { ...rawProps }>
            {props.content || props.renderContent?.()}
        </div>
    );

    const renderDropdownBody = (props: DropdownBodyProps) => {
        if (isTooltipExist()) {
            return (
                <DropdownContainer focusLock={ false } showArrow={ true } maxWidth={ maxWidth ?? 300 } cx={ cx(tooltipCX, uuiElement.tooltipContainer) } { ...props }>
                    {renderTooltip()}
                </DropdownContainer>
            );
        } else {
            return null;
        }
    };

    const renderTarget = (props: IDropdownToggler) =>
        React.Children.map(children, (child, idx) => {
            if (idx > 0 || !React.isValidElement(child)) return child;
            return React.cloneElement<React.ComponentPropsWithRef<any>>(child, { ref: props.ref });
        });

    return (
        <Dropdown
            { ...props }
            renderBody={ (props) => renderDropdownBody(props) }
            openOnHover={ true }
            closeOnMouseLeave={ closeOnMouseLeave ?? 'toggler' }
            placement={ props.placement || 'top' }
            modifiers={ [{ name: 'offset', options: { offset: props.offset || [0, 12] } }] }
            renderTarget={ (props: IDropdownToggler) => renderTarget(props) }
        />
    );
}
