import { FillStyle, ControlShape, ColorMod } from "../types";
import { Button as uuiButton, ButtonMode, UUIButtonProps, ControlSize } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { systemIcons } from '../icons/icons';
import css from './Button.scss';

const defaultSize = '36';

export interface ButtonMods extends ColorMod {
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

export function applyButtonMods(mods: ButtonMods) {
    return [
        'uui-theme-loveship',
        `button-${mods.color || 'sky'}`,
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
        mode: mapFillToMod[props.fill] || mapFillToMod.solid,
    }),
);
