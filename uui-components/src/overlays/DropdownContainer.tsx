import * as React from 'react';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef } from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import * as css from './PopoverArrow.scss';
import { PopperArrowProps } from "react-popper";
import { DropdownPlacement } from "./Dropdown";
import PopoverArrow from "./PopoverArrow";

export interface DropdownContainerProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    width?: number | 'auto';
    maxWidth?: number;
    height?: number;
    showArrow?: boolean;
    style?: React.CSSProperties;
    arrowProps?: PopperArrowProps;
    placement?: DropdownPlacement;
}

export class DropdownContainer extends React.Component<DropdownContainerProps> {

    render() {
        return (
            <VPanel
                forwardedRef={ this.props.forwardedRef }
                cx={ cx(uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus, css.containerPopover, 'uui-dropdown-container') }
                style={ { ...this.props.style, minWidth: this.props.width, minHeight: this.props.height, maxWidth: this.props.maxWidth } }
                rawProps={ { tabIndex: 0, ...this.props.rawProps, ['data-placement']: this.props.placement } }
            >
                { this.props.children }
                { this.props.showArrow && <PopoverArrow  ref={ this.props?.arrowProps?.ref } style={ this.props?.arrowProps?.style } /> }
            </VPanel>
        );
    }
}