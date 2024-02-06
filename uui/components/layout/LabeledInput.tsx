import * as types from '../types';
import { withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { Tooltip } from '../overlays/Tooltip';
import { ReactComponent as FillInfoIcon } from '../../icons/notification-info-fill-24.svg';
import { ReactComponent as InfoIcon } from '../../icons/notification-info-outline-24.svg';
import css from './LabeledInput.module.scss';

const DEFAULT_SIZE = '36';

interface LabeledInputMods extends types.SizeMod {}

/** Represents the properties of the LabeledInput component. */
export type LabeledInputProps = uuiComponents.LabeledInputProps & LabeledInputMods;

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [css.root, css['size-' + (mods.size || DEFAULT_SIZE)]];
}

export const LabeledInput = withMods<uuiComponents.LabeledInputProps, LabeledInputMods>(uuiComponents.LabeledInput, applyLabeledInputMods, (props) => ({
    Tooltip,
    infoIcon: props.infoIcon || (['24', '30'].includes(props.size) ? FillInfoIcon : InfoIcon),
}));
