import * as React from 'react';
import { ButtonBaseProps, ButtonBase } from '@epam/uui-components';
import { IconContainer } from '@epam/uui-components';
import * as css from './IconButton.scss';
import * as styles from '../../assets/styles/colorvars/buttons/iconButton-colorvars.scss';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../types';

export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60'];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends ButtonBaseProps, IconButtonMods { }

export class IconButton extends ButtonBase<IconButtonProps> {
    constructor(props: IconButtonProps) {
        super(props);
    }

    getClassName() {
        return [
            css.root,
            styles['icon-color-' + (this.props.color || 'gray60')],
        ];
    }

    getChildren() {
        return [
            <IconContainer key={ 'icon' } icon={ this.props.icon } />,
        ];
    }
}