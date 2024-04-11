import { withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as uuiRadioInputProps } from '@epam/uui-components';
import css from './RadioInput.module.scss';
import { ReactComponent as RadioPoint } from '@epam/assets/icons/radio_dot-fill.svg';

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

export const RadioInput = /* @__PURE__ */withMods<uuiRadioInputProps, RadioInputMods>(
    uuiRadioInput,
    applyRadioInputMods,
    (props) => ({ icon: props.icon ? props.icon : RadioPoint }),
);
