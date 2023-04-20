import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as UuiRadioInputProps } from '@epam/uui-components';
import css from './RadioInput.scss';
import { ReactComponent as RadioPoint } from '../../icons/radio-point.svg';

export interface RadioInputMods {
    size?: '12' | '18';
}

export type RadioInputProps = RadioInputMods & UuiRadioInputProps;

function applyRadioInputMods(mods: RadioInputProps) {
    return [css.root, css['size-' + (mods.size || '18')]];
}

export const RadioInput = withMods<UuiRadioInputProps, RadioInputMods>(uuiRadioInput, applyRadioInputMods, () => ({ icon: RadioPoint }));
