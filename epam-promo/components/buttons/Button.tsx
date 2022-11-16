import { Button as uuiButton, UUIButtonProps, ButtonMode } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { ControlSize, FillStyle } from '../types';
import { systemIcons } from '../../icons/icons';
import * as css from './Button.scss';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50';
export const allButtonColors: ButtonColor[] = ['blue', 'green', 'red', 'gray50'];

const defaultSize = '36';

export interface ButtonMods {
    /** Button size */
    size?: ControlSize | '18';
    /** Fill style: solid (normal), light (washed color), white, or none (just button label is visible) */
    fill?: FillStyle;
    /** Button color */
    color?: ButtonColor;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export function applyButtonMods(mods: Omit<UUIButtonProps, "color"> & ButtonMods) {
    return [
        'button-color-' + (mods.color || 'blue'),
        css['size-' + (mods.size || defaultSize)],
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