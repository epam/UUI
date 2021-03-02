import * as React from 'react';
import { ButtonBaseProps, ButtonBase } from '@epam/uui-components';
import { IconContainer } from '@epam/uui-components';
import * as types from '../types';
import * as css from './IconButton.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';

export interface IconButtonProps extends ButtonBaseProps, types.ColorMod { }

export class IconButton extends ButtonBase<IconButtonProps> {
    constructor(props: IconButtonProps) {
        super(props);
    }

    getClassName() {
        return [
            css.root,
            styles['color-' + (this.props.color || 'night600')],
        ];
    }

    getChildren() {
        return [
            <IconContainer key={ 'icon' } icon={ this.props.icon } />,
        ];
    }
}