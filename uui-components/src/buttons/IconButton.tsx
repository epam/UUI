import * as React from 'react';
import { ButtonBaseProps, ButtonBase } from './ButtonBase';
import { IconContainer } from '../layout';
import css from './Button.module.scss';

export interface IconButtonBaseProps extends ButtonBaseProps {}

export class IconButton extends ButtonBase<IconButtonBaseProps> {
    constructor(props: IconButtonBaseProps) {
        super(props);
    }

    getFixedSize() {
        return {
            width: '12px',
            height: '24px',
        };
    }

    getClassName() {
        return [css.container];
    }

    getChildren() {
        return <IconContainer key="icon" icon={ this.props.icon } style={ this.getFixedSize() } />;
    }
}
