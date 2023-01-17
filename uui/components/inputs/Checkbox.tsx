import { withMods } from '@epam/uui-core';
import { Checkbox as uuiCheckbox, CheckboxProps as UuiCheckboxProps } from '@epam/uui-components';
import css from './Checkbox.scss';

export interface CheckboxMods {
    size?: '12' | '18';
    mode?: 'form' | 'cell';
}

export type CheckboxProps = CheckboxMods & UuiCheckboxProps;

export function applyCheckboxMods(mods: CheckboxProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        css['mode-' + (mods.mode || 'form')],
    ];
}

export const Checkbox = withMods<UuiCheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods);
