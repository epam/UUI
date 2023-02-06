import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps } from '@epam/uui-components';
import '../../assets/styles/variables/inputs/radioInput.scss';
import css from './RadioInput.scss';
import { ReactComponent as RadioPoint } from '../../icons/radio-point.svg';

export interface RadioInputMods {
    size?: '12' | '18';
}

function applyRadioInputMods(mods: RadioInputMods & RadioInputProps) {
    return [
        'radio-input-vars',
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const RadioInput = withMods<RadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: RadioPoint }));
