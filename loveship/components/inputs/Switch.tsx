import * as css from './Switch.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { Switch as uuiSwitch, SwitchProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as types from '../types';

export interface SwitchMods extends types.ColorMod {
    size?: '12' | '18' | '24';
    theme?: 'light' | 'dark';
}

export function applySwitchMods(mods: SwitchMods & SwitchProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        styles['color-' + (mods.color || 'sky')],
        css['theme-' + (mods.theme || 'light')],
    ];
}

export const Switch = withMods<SwitchProps, SwitchMods>(uuiSwitch, applySwitchMods);