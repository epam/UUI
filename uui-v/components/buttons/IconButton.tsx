import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as css from './IconButton.scss';
import * as styles from '../../assets/styles/colorvars/buttons/iconButton-colorvars.scss';

export type IconColor = 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'default';
export const allIconColors: IconColor[] = ['info', 'success', 'warning', 'error', 'secondary', 'default'];

export interface IconButtonMods {
    color?: IconColor;
}

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods { }

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        css.root,
        styles['icon-color-' + (mods.color || 'default')],
    ];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);