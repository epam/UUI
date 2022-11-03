import * as types from '../types';
import { withMods } from '@epam/uui-core';
import { LabeledInput as uuiLabeledInput, LabeledInputProps } from '@epam/uui-components';
import { Tooltip } from '../overlays';
import { getIcon } from '../../icons';
import '../../assets/styles/variables/layout/labeledInput.scss';
import * as css from './LabeledInput.scss';

export interface LabeledInputMods extends types.SizeMod {}

function applyLabeledInputMods(mods: LabeledInputMods) {
    return [
        'labeled-input-vars',
        css.root,
        mods.size && `labeled-input-${mods.size}`,
    ];
}

export const LabeledInput = withMods<LabeledInputProps, LabeledInputMods>(uuiLabeledInput, applyLabeledInputMods, () => ({
    Tooltip,
    infoIcon: getIcon('help'),
}));