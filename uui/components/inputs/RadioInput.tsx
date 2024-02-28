import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as uuiRadioInputProps } from '@epam/uui-components';
import css from './RadioInput.module.scss';
// TODO: needs icon from designers
import { ReactComponent as RadioPoint } from '../../icons/radio-point.svg';

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
        css['size-' + (mods.size || '18')],
        'uui-radio-input-container',
        'uui-color-primary',
    ];
}

export const RadioInput = withMods<uuiRadioInputProps, RadioInputMods>(
    uuiRadioInput,
    applyRadioInputMods,
    (props) => ({ icon: props.icon ? props.icon : RadioPoint }),
);
