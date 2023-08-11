import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.module.scss';

export type IconColor = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'default';
export const allIconColors: IconColor[] = [
    'info', 'success', 'warning', 'error', 'secondary', 'default',
];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods {}

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return ['uui-icon_button', `uui-color-${mods.color || 'default'}`, css.root]; // TODO: default - wrong naming need fix it
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);
