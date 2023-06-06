import { Checkbox as uuiCheckbox, CheckboxProps, CheckboxMods as UuiCheckboxMods } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import css from './Checkbox.module.scss';

export interface CheckboxMods extends UuiCheckboxMods {
    theme?: 'light' | 'dark';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [mods.theme === 'dark' && css['theme-dark']];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods);
