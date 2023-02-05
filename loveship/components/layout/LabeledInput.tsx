import { withMods } from '@epam/uui-core';
import { LabeledInput as uuiLabeledInput, LabeledInputMods as uuiLabeledInputMods } from '@epam/uui';
import { LabeledInputProps } from '@epam/uui-components';
import * as types from '../types';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';

export interface LabeledInputMods extends types.ColorMod, uuiLabeledInputMods {}

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [
        'uui-theme-loveship',
        styles['color-' + (mods.color || 'night700')],
    ];
}

export const LabeledInput = withMods<LabeledInputProps, LabeledInputMods>(uuiLabeledInput, applyLabeledInputMods);
