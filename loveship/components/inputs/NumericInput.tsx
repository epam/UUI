import * as types from '../types';
import * as css from './NumericInput.scss';
import * as colorStyle from '../../assets/styles/scss/loveship-color-vars.scss';
import { withMods } from '@epam/uui';
import { NumericInput as uuiNumericInput, NumericInputProps } from '@epam/uui-components';
import { TextSettings, getTextClasses } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

const defaultSize = '36';

export interface NumericInputMods extends types.EditMode, types.SizeMod, TextSettings {
}

export function applyNumericInputMods(mods: NumericInputMods) {
    return [
        colorStyle.colorSky,
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['mode-' + (mods.mode || 'form')],
    ];
}

export const NumericInput = withMods<NumericInputProps, NumericInputMods>(
    uuiNumericInput,
    applyNumericInputMods,
    (props) => ({
        upIcon: systemIcons[props.size || defaultSize].foldingArrow,
        downIcon: systemIcons[props.size || defaultSize].foldingArrow,
        inputCx: getTextClasses({
            size: props.size || defaultSize,
            lineHeight: props.lineHeight,
            fontSize: props.fontSize,
        }, true),
    }),
);