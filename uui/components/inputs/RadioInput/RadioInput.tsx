import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps } from '@epam/uui-components';
import { ReactComponent as RadioPoint } from '../../../icons/radio-point.svg';
import * as css from './RadioInput.scss';
import './RadioInput.colorvars.scss';

export interface RadioInputMods {
    size?: string;
}

function applyRadioInputMods(mods: RadioInputMods & RadioInputProps) {
    return [
        'radio-input-vars',
        css.root,
        mods.size && `size-${ mods.size }`,
    ];
}

export const RadioInput = withMods<RadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: RadioPoint }));