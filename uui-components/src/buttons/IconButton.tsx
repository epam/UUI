import * as React from 'react';
import { ButtonBaseProps, ButtonBase } from './ButtonBase';
import { IconContainer } from '../layout';
import css from './Button.module.scss';

export type IconButtonBaseProps<T> = ButtonBaseProps<T> & {};

export class IconButton<T> extends ButtonBase<IconButtonBaseProps<T>> {
    constructor(props: IconButtonBaseProps<T>) {
        super(props);
    }

    getClassName() {
        return [css.container];
    }

    getChildren() {
        return <IconContainer key="icon" icon={ this.props.icon } />;
    }
}
