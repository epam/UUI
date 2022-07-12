import * as React from 'react';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef } from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import * as css from './DropdownContainer.scss';
import { PopperArrowProps } from "react-popper";

export interface DropdownContainerProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    width?: number | 'auto';
    maxWidth?: number;
    height?: number;
    showArrow?: boolean;
    style?: React.CSSProperties;
    arrowProps?: PopperArrowProps;
}

export class DropdownContainer extends React.Component<DropdownContainerProps> {

    render() {
        return (
            <VPanel
                forwardedRef={ this.props.forwardedRef }
                cx={ cx(css.container, uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus) }
                style={ { ...this.props.style, minWidth: this.props.width, minHeight: this.props.height, maxWidth: this.props.maxWidth } }
                rawProps={ { tabIndex: 0, ...this.props.rawProps } }
            >
                { this.props.children }
                { this.props.showArrow && <div ref={ this.props?.arrowProps?.ref } style={ this.props?.arrowProps?.style } className='uui-dropdown-arrow'  /> }
            </VPanel>
        );
    }
}