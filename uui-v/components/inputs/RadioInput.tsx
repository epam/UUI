import { withMods } from '@epam/uui';
import { RadioInput as uuiRadioInput, RadioInputProps } from '@epam/uui-components';
import '../../assets/styles/colorvars/inputs/radioInput-colorvars.scss';
import * as css from './RadioInput.scss';
import * as radioPoint from '../../icons/radio-point.svg';

export interface RadioInputMods {
    size?: '12' | '18';
}

function applyRadioInputMods(mods: RadioInputMods & RadioInputProps) {
    return [
        'radio-input-colors',
        css.root,
        css['size-' + (mods.size || '18')],
    ];
}

export const RadioInput = withMods<RadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: radioPoint }));