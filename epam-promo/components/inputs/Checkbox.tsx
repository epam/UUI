import css from './Checkbox.scss';
import styles from '../../assets/styles/colorvars/inputs/checkbox-colorvars.scss';
import { Checkbox as uuiCheckbox, CheckboxProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ReactComponent as Check_12 } from '../../icons/check-12.svg';
import { ReactComponent as Check_18 } from '../../icons/check-18.svg';
import { ReactComponent as PartlySelect_12 } from '../../icons/partly-select-12.svg';
import { ReactComponent as PartlySelect_18 } from '../../icons/partly-select-18.svg';

export interface CheckboxMods {
    /** Checkbox size */
    size?: '12' | '18';
    /** Set to 'dark' to make component work on a dark background */
    theme?: 'light' | 'dark';
    mode?: 'form' | 'cell';
}

export function applyCheckboxMods(mods: CheckboxMods & CheckboxProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        css['mode-' + (mods.mode || 'form')],
        styles['checkbox-color-blue'],
    ];
}

export const Checkbox = withMods<CheckboxProps, CheckboxMods>(uuiCheckbox, applyCheckboxMods, (props) => ({
    icon: (props.size === '12') ? Check_12 : Check_18,
    indeterminateIcon: (props.size === '12') ? PartlySelect_12 : PartlySelect_18,
}));
