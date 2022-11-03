import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import * as css from './IconButton.scss';
import './IconButton.vars.scss';
import { uuiComponentClass } from '../../constant';

export type IconColor = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'default';
export const allIconColors: IconColor[] = ['info', 'success', 'warning', 'error', 'secondary', 'default'];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods { }

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        uuiComponentClass.iconButton,
        `icon-button-color-${mods.color || 'default'}`,
        css.root,
    ];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);