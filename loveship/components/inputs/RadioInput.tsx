import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as UuiRadioInputProps, RadioInputMods as UuiRadioInputMods } from '@epam/uui';
import * as types from '../types';
import css from './RadioInput.scss';
import { ReactComponent as RadioPoint } from '../icons/radio-point.svg';

export interface RadioInputMods extends UuiRadioInputMods {
    color?: types.ColorMod;
    theme?: 'light' | 'dark';
}

export interface RadioInputProps extends  RadioInputMods, UuiRadioInputProps {}

function applyRadioInputMods(mods: RadioInputProps) {
    return [
        'uui-theme-loveship',
        mods.theme === 'dark' && css.themeDark,
    ];
}

export const RadioInput = withMods<UuiRadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: RadioPoint }));
