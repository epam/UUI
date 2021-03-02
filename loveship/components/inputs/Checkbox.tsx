import * as types from '../types';
import * as css from './Checkbox.scss';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as tickIcon from '../icons/checkbox-checked.svg';
import * as indeterminateIcon from '../icons/checkbox-partial.svg';
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

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, () => ({ icon: tickIcon, indeterminateIcon }));