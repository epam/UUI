import { IconButton as uuiIconButton, IconButtonBaseProps } from '@epam/uui-components';
import * as types from '../types';
import * as css from './IconButton.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui';

interface IconButtonMods extends types.ColorMod {};

export interface IconButtonProps extends IconButtonBaseProps, IconButtonMods {};

function applyIconButtonMods(mods: IconButtonProps & IconButtonMods) {
    return [
        css.root,
        styles['icon-color-' + (mods.color || 'night600')],
    ]
}

export const IconButton = withMods<IconButtonProps, IconButtonMods>(uuiIconButton, applyIconButtonMods);