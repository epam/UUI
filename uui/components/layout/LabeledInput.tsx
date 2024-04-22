import * as types from '../types';
import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Tooltip } from '../overlays/Tooltip';
import { ReactComponent as FillInfoIcon } from '@epam/assets/icons/notification-info-fill.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/notification-info-outline.svg';
import css from './LabeledInput.module.scss';

const DEFAULT_SIZE = '36';

interface LabeledInputMods extends types.SizeMod {}

export interface LabeledInputModsOverride {}

/** Represents the properties of the LabeledInput component. */
export type LabeledInputProps = uuiComponents.LabeledInputProps & Overwrite<LabeledInputMods, LabeledInputModsOverride>;

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [css.root, css['size-' + (mods.size || DEFAULT_SIZE)]];
}

export const LabeledInput = withMods<uuiComponents.LabeledInputProps, LabeledInputProps>(uuiComponents.LabeledInput, applyLabeledInputMods, (props) => ({
    Tooltip: props.Tooltip || Tooltip,
    infoIcon: props.infoIcon || (['24', '30'].includes(props.size) ? FillInfoIcon : InfoIcon),
}));
