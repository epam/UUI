import * as React from 'react';
import * as css from './DropdownContainer.scss';
import { uuiElement, IHasCX, IHasChildren, cx, IHasRawProps } from '@epam/uui';
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
                cx={ cx(css.container, uuiElement.dropdownBody, this.props.cx) }
                style={ { minWidth: this.props.width, minHeight: this.props.height } }
                rawProps={this.props.rawProps}
            >
                { this.props.children }
            </VPanel>
        );
    }
}