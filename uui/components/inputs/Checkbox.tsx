import { withMods } from '@epam/uui-core';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import css from './Checkbox.scss';
import { ReactComponent as Check_12 } from '../../icons/check-12.svg';
import { ReactComponent as Check_18 } from '../../icons/check-18.svg';
import { ReactComponent as PartlySelect_12 } from '../../icons/partly-select-12.svg';
import { ReactComponent as PartlySelect_18 } from '../../icons/partly-select-18.svg';
import '../../assets/styles/variables/inputs/checkbox.scss';

export interface CheckboxMods {
    size?: '12' | '18';
    theme?: 'light' | 'dark';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        'checkbox-vars',
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, (props) => ({
    icon: (props.size === '12') ? Check_12 : Check_18,
    indeterminateIcon: (props.size === '12') ? PartlySelect_12 : PartlySelect_18,
}));
