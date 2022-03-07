import * as React from 'react';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers, IHasForwardedRef } from '@epam/uui-core';
import { VPanel } from '../layout/flexItems/VPanel';
import * as css from './DropdownContainer.scss';

export interface DropdownContainerProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}

export class DropdownContainer extends React.Component<DropdownContainerProps> {
    render() {
        return (
            <VPanel
                forwardedRef={ this.props.forwardedRef }
                cx={ cx(css.container, uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus) }
                style={ { ...this.props.style, minWidth: this.props.width, minHeight: this.props.height } }
                rawProps={ { tabIndex: 0, ...this.props.rawProps } }
            >
                { this.props.children }
            </VPanel>
        );
    }
}