import * as uuiComponents from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import css from './IconButton.module.scss';

interface IconButtonMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral';
}

/** Represents the Core properties of the IconButton component. */
export type IconButtonCoreProps = uuiComponents.IconButtonProps;

/** Represents the properties of the IconButton component. */
export type IconButtonProps = IconButtonCoreProps & IconButtonMods;

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return ['uui-icon_button', `uui-color-${mods.color || 'neutral'}`, css.root];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiComponents.IconButton, applyIconButtonMods);
