import * as React from 'react';
import cx from 'classnames';
import * as css from './DropdownContainer.scss';
import { uuiElement, IHasCX, IHasChildren } from '@epam/uui';
import { VPanel } from '../layout/flexItems/VPanel';

export interface DropdownContainerProps extends IHasCX, IHasChildren {
    width?: number;
    height?: number;
}

export class DropdownContainer extends React.Component<DropdownContainerProps, any> {

    render() {
        return (
            <VPanel
                cx={ cx(css.container, uuiElement.dropdownBody, this.props.cx) }
                style={ { minWidth: this.props.width, minHeight: this.props.height } }
            >
                { this.props.children }
            </VPanel>
        );
    }
}