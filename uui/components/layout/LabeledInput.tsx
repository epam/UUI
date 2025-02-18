import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Tooltip } from '../overlays/Tooltip';
import { settings } from '../../index';

import css from './LabeledInput.module.scss';

interface LabeledInputMods {
    /**
     * Defines component size.
     */
    size?: '24' | '30' | '36' | '42' | '48';
}

export interface LabeledInputModsOverride {}

/** Represents the properties of the LabeledInput component. */
export interface LabeledInputProps extends uuiComponents.LabeledInputProps, Overwrite<LabeledInputMods, LabeledInputModsOverride> {}

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [
        'uui-labeled-input',
        css.root,
        'uui-size-' + (mods.size || settings.labeledInput.sizes.default),
    ];
}

function applyLabeledInputProps(props: LabeledInputProps) {
    return ({
        Tooltip: props.Tooltip || Tooltip,
        infoIcon: props.infoIcon || props.size <= '30' ? settings.labeledInput.icons.fillInfoIcon : settings.labeledInput.icons.infoIcon,
    });
}

export const LabeledInput = withMods<uuiComponents.LabeledInputProps, LabeledInputProps>(
    uuiComponents.LabeledInput,
    applyLabeledInputMods,
    applyLabeledInputProps,
);
