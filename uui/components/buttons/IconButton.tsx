import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.scss';

export type IconColor = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'default';
export const allIconColors: IconColor[] = ['info', 'success', 'warning', 'error', 'secondary', 'default'];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods {}

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        `icon-button-${mods.color || 'default'}`,
        css.root,
    ];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);
