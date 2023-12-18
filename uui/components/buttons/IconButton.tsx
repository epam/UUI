import { IconButtonBaseProps, IconButton as uuiIconButton } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.module.scss';

interface IconButtonMods {
    /**
     * @default 'default'
     */
    color?: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral';
}

export type IconButtonCoreProps = IconButtonBaseProps & {};
export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return ['uui-icon_button', `uui-color-${mods.color || 'neutral'}`, css.root];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);
