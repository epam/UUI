import * as types from '../types';
import * as css from './NumericInput.scss';
import * as textInputCss from './TextInput.scss';
import { withMods } from '@epam/uui';
import { NumericInput as uuiNumericInput, NumericInputProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';

const defaultSize = '36';

export interface NumericInputMods extends types.SizeMod {
}

export function applyNumericInputMods(mods: NumericInputMods) {
    return [
        textInputCss.root,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        textInputCss['size-' + (mods.size || defaultSize)],
    ];
}

export const NumericInput = withMods<NumericInputProps, NumericInputMods>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => ({
        upIcon: systemIcons[props.size || defaultSize].foldingArrow,
        downIcon: systemIcons[props.size || defaultSize].foldingArrow,
    }),
);