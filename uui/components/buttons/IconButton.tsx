import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import '../../assets/styles/variables/buttons/iconButton.scss';
import './IconButton.colorvars.scss';
import css from './IconButton.scss';

export type UuiIconColor = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'default';
export const allIconColors: UuiIconColor[] = ['info', 'success', 'warning', 'error', 'secondary', 'default'];

export interface UuiIconButtonMods {
    color?: UuiIconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, UuiIconButtonMods { }

export type UuiIconButtonProps = IconButtonProps & UuiIconButtonMods;

function applyIconButtonMods(mods: UuiIconButtonProps) {
    return [
        `icon-button-color-${mods.color || 'default'}`,
        css.root,
    ];
}

export const IconButton = withMods<IconButtonProps, UuiIconButtonMods>(uuiIconButton, applyIconButtonMods);
