import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as uuiRadioInputProps } from '@epam/uui-components';
import { ReactComponent as RadioPoint } from '@epam/assets/icons/radio_dot-fill.svg';
import { settings } from '../../settings';
import css from './RadioInput.module.scss';

type RadioInputMods = {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: '12' | '18';
};

/** Represents the properties of a RadioInput component. */
export type RadioInputProps = RadioInputMods & uuiRadioInputProps;

function applyRadioInputMods(mods: RadioInputProps) {
    return [
        css.root,
        css['size-' + (mods.size || settings.sizes.defaults.radioInput)],
        'uui-radio-input-container',
        'uui-color-primary',
    ];
}

export const RadioInput = withMods<uuiRadioInputProps, RadioInputProps>(
    uuiRadioInput,
    applyRadioInputMods,
    (props) => ({ icon: props.icon ? props.icon : RadioPoint }),
);
