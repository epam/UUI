import { FillStyle, ControlSize, ControlShape, ColorMod } from "../types";
import { Button as uuiButton, ButtonMode, UUIButtonProps } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { TextSettings, getTextClasses } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';
import * as css from './Button.scss';

const defaultSize = '36';

export interface ButtonMods extends ColorMod, TextSettings {
    size?: ControlSize | '42' | '18';
    shape?: ControlShape;
    fill?: FillStyle;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export function applyButtonMods(mods: Omit<UUIButtonProps, "color"> & ButtonMods) {
    return [
        'color-' + (mods.color || 'sky'),
        css['size-' + (mods.size || defaultSize)],
        css['style-' + (mods.shape || 'square')],
    ];
}

export const Button = withMods<Omit<UUIButtonProps, "color">, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
        captionCX: getTextClasses({
            size: props.size || defaultSize,
            lineHeight: props.lineHeight,
            fontSize: props.fontSize,
        }, true),
        mode: mapFillToMod[props.fill] || mapFillToMod.solid,
    }),
);