import * as React from 'react';
import * as css from './DropdownContainer.scss';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps, uuiMarkers } from '@epam/uui';
import { VPanel } from '../layout/flexItems/VPanel';

export interface DropdownContainerProps extends IHasCX, IHasChildren, IHasRawProps<HTMLDivElement> {
    width?: number;
    height?: number;
    style?: React.CSSProperties;
}
export class DropdownContainer extends React.Component<DropdownContainerProps, any> {
    render() {
        return (
            <VPanel
                cx={ cx(css.container, uuiElement.dropdownBody, this.props.cx, uuiMarkers.lockFocus) }
                style={ { ...this.props.style, minWidth: this.props.width, minHeight: this.props.height } }
                rawProps={ { tabIndex: 0, ...this.props.rawProps } }
            >
                { this.props.children }
            </VPanel>
        );
    }
}