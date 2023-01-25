import * as React from 'react';
import { RadioInput as uuiRadioInput, RadioInputProps as UuiRadioInputProps, RadioInputMods as UuiRadioInputMods } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { ReactComponent as RadioPoint } from '../../icons/radio-point.svg';

export interface RadioInputMods extends UuiRadioInputMods {}

export interface RadioInputProps extends  RadioInputMods, UuiRadioInputProps {}

function applyRadioInputMods(mods: RadioInputProps) {
    return [
        'uui-theme-promo',
    ];
}

export const RadioInput = withMods<UuiRadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: RadioPoint }));
