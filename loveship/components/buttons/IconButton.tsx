import { IconButton as uuiIconButton, IconButtonBaseProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import * as types from '../types';
import css from './IconButton.scss';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';

interface IconButtonMods extends types.ColorMod {};

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods {};

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        css.root,
        styles['color-' + (mods.color || 'night600')],
    ];
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);
