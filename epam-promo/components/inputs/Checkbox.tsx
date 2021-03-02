import * as types from '../types';
import * as css from './Checkbox.scss';
import * as styles from '../../assets/styles/colorvars/inputs/checkbox-colorvars.scss';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as check_12 from '../../icons/check-12.svg';
import * as check_18 from '../../icons/check-18.svg';
import * as partlySelect_12 from '../../icons/partly-select-12.svg';
import * as partlySelect_18 from '../../icons/partly-select-18.svg';

export interface CheckboxMods {
    size?: '12' | '18';
    fill?: types.FillStyle;
    theme?: 'light' | 'dark';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        styles['checkbox-color-blue'],
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, (props) => ({
    icon: (props.size === '12') ? check_12 : check_18,
    indeterminateIcon: (props.size === '12') ? partlySelect_12 : partlySelect_18,
}));