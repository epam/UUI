import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { LabeledInput as uuiLabeledInput, LabeledInputProps } from '@epam/uui-components';
import { Tooltip } from '../overlays';
import { systemIcons } from '../../icons/icons';
import css from './LabeledInput.scss';


const defaultSize = '36';

export interface LabeledInputMods extends types.SizeMod {}

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const LabeledInput = withMods<LabeledInputProps, LabeledInputMods>(uuiLabeledInput, applyLabeledInputMods, (props) => ({
    Tooltip,
    infoIcon: systemIcons[props.size || defaultSize].help,
}));
