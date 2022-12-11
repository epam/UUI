import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.scss';
import styles from '../../assets/styles/colorvars/buttons/iconButton-colorvars.scss';
import { allEpamPrimaryColors, EpamPrimaryColor } from '../types';

export type IconColor = EpamPrimaryColor | 'gray30' | 'gray50' | 'gray60';
export const allIconColors: IconColor[] = [...allEpamPrimaryColors, 'gray30', 'gray50', 'gray60'];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods { }

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        css.root,
        styles['icon-color-' + (mods.color || 'gray60')],
    ];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);
