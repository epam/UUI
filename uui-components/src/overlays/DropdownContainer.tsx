import * as React from 'react';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef, IDropdownBodyProps } from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import PopoverArrow from './PopoverArrow';

export interface DropdownContainerProps
    extends IHasCX,
        IHasChildren,
        IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
        IHasForwardedRef<HTMLDivElement>,
        IDropdownBodyProps {
    width?: number | 'auto';
    maxWidth?: number;
    height?: number;
    showArrow?: boolean;
    style?: React.CSSProperties;
}

export class DropdownContainer extends React.Component<DropdownContainerProps> {
    render() {
        return (
            <VPanel
                forwardedRef={this.props.forwardedRef}
                cx={cx(uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus)}
                style={{ ...this.props.style, minWidth: this.props.width, minHeight: this.props.height, maxWidth: this.props.maxWidth }}
                rawProps={{ tabIndex: 0, ...this.props.rawProps }}
            >
                {this.props.children}
                {this.props.showArrow && (
                    <PopoverArrow ref={this.props?.arrowProps?.ref} arrowProps={this.props?.arrowProps} placement={this.props?.placement || 'bottom-start'} />
                )}
            </VPanel>
        );
    }
}
