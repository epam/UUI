import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Tooltip } from '../overlays/Tooltip';
import { ReactComponent as FillInfoIcon } from '@epam/assets/icons/notification-info-fill.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/notification-info-outline.svg';
import { settings } from '../../settings';
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
        'uui-size-' + (mods.size || settings.sizes.defaults.labeledInput),
    ];
}

export const LabeledInput = withMods<uuiComponents.LabeledInputProps, LabeledInputProps>(uuiComponents.LabeledInput, applyLabeledInputMods, (props) => ({
    Tooltip: props.Tooltip || Tooltip,
    infoIcon: props.infoIcon || (settings.sizes.labeledInput.fillIcon.includes(props.size) ? FillInfoIcon : InfoIcon),
}));
