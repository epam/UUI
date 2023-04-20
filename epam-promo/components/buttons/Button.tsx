import { Button as uuiButton, ButtonProps as UuiButtonProps, ButtonMode } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { FillStyle } from '../types';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50';
export const allButtonColors: ButtonColor[] = [
    'blue',
    'green',
    'red',
    'gray50',
];

export interface ButtonMods {
    fill?: FillStyle;
    color?: ButtonColor;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiButtonProps, 'color'> & ButtonMods;

export const Button = withMods<Omit<UuiButtonProps, 'color'>, ButtonMods>(
    uuiButton,
    () => [],
    (props) => ({
        mode: mapFillToMod[props.fill] || mapFillToMod.solid,
    }),
);
