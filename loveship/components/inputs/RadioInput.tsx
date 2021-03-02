import * as css from './RadioInput.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import { RadioInput as uuiRadioInput, RadioInputProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import * as radioPoint from '../icons/radio-point.svg';
import * as types from '../types';

export interface RadioInputMods {
    size?: '12' | '18';
    color?: types.ColorMod;
    theme?: 'light' | 'dark';
}

function applyRadioInputMods(mods: RadioInputMods & RadioInputProps) {
    return [
        css.root,
        css['size-' + (mods.size || '18')],
        styles['color-' + (mods.color || 'sky')],
        css['theme-' + (mods.theme || 'light')],
    ];
}

export const RadioInput = withMods<RadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: radioPoint }));