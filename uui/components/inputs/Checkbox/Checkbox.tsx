import { withMods } from '@epam/uui-core';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import { getIcon } from '../../../icons';
import * as css from './Checkbox.scss';
import './Checkbox.colorvars.scss';

export interface CheckboxMods {
    size?: string;
    theme?: 'light' | 'dark';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        'checkbox-colorvars',
        css.root,
        mods.size && `size-${mods.size}`,
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, () => ({
    icon: getIcon('check'),
    indeterminateIcon: getIcon('partlySelect'),
}));