import { Checkbox as uuiCheckbox, CheckboxProps, CheckboxMods as UuiCheckboxMods } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { ReactComponent as Check_12 } from '../../icons/check-12.svg';
import { ReactComponent as Check_18 } from '../../icons/check-18.svg';
import { ReactComponent as PartlySelect_12 } from '../../icons/partly-select-12.svg';
import { ReactComponent as PartlySelect_18 } from '../../icons/partly-select-18.svg';

export interface CheckboxMods extends UuiCheckboxMods {}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        'uui-theme-promo',
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, (props) => ({
    icon: (props.size === '12') ? Check_12 : Check_18,
    indeterminateIcon: (props.size === '12') ? PartlySelect_12 : PartlySelect_18,
}));
