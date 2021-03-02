import * as css from './LabeledInput.scss';
import * as types from '../types';
import { withMods } from '@epam/uui';
import { LabeledInput as uuiLabeledInput, LabeledInputProps } from '@epam/uui-components';
import { Tooltip } from '../overlays';
import { systemIcons } from '../../icons/icons';


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