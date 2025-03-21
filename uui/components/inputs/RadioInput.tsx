import { Overwrite, withMods } from '@epam/uui-core';
import { RadioInput as uuiRadioInput, RadioInputProps as uuiRadioInputProps } from '@epam/uui-components';
import { settings } from '../../settings';

import css from './RadioInput.module.scss';

type RadioInputMods = {
    /**
     * Defines component size.
     * @default '18'
     */
    size?: '12' | '18';
};

export interface RadioInputModsOverride {}

/** Represents the properties of a RadioInput component. */
export interface RadioInputProps extends uuiRadioInputProps, Overwrite<RadioInputMods, RadioInputModsOverride> {}

function applyRadioInputMods(mods: RadioInputProps) {
    return [
        css.root,
        `uui-size-${mods.size || settings.radioInput.sizes.default}`,
        'uui-radio-input-container',
        'uui-color-primary',
    ];
}

export const RadioInput = withMods<uuiRadioInputProps, RadioInputProps>(
    uuiRadioInput,
    applyRadioInputMods,
    (props) => ({ icon: props.icon ? props.icon : settings.radioInput.icons.dotIcon }),
);
