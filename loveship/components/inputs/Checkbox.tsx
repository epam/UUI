import * as types from '../types';
import * as css from './Checkbox.scss';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ReactComponent as TickIcon } from '../icons/checkbox-checked.svg';
import { ReactComponent as IndeterminateIcon } from '../icons/checkbox-partial.svg';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';

export interface CheckboxMods extends types.ColorMod {
    size?: '12' | '18';
    theme?: 'light' | 'dark';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        css['theme-' + (mods.theme || 'light')],
        styles['color-' + (mods.color || 'sky')],
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, () => ({ icon: TickIcon, IndeterminateIcon }));