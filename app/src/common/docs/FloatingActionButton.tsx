import * as React from 'react';
import * as css from './FloatingActionButton.scss';
import { Button, IconContainer, Tooltip } from '@epam/promo';
import { cx, Icon } from '@epam/uui';

interface FloatingActionButtonProps {
    icon: Icon;
    buttonCx: string;
    onClick(): void;
    tooltip: string;
}

export class FloatingActionButton extends React.Component<FloatingActionButtonProps, any> {
    render() {
        return <Tooltip content={ this.props.tooltip } placement='auto' trigger='hover' >
            <Button fill="white" color="blue" icon={ this.props.icon } size="48" onClick={ this.props.onClick } cx={ cx(css.root, this.props.buttonCx) } />
        </Tooltip>;
    }
}