import { Button as uuiButton, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, FillStyle } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './Button.scss';
import styles from '../../assets/styles/colorvars/buttons/button-colorvars.scss';

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

export function applyButtonMods(mods: ButtonMods & ButtonProps) {
    return [
        styles['button-color-' + (mods.color || 'blue')],
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
    ];
}

export const Button = withMods<ButtonProps, ButtonMods>(uuiButton, applyButtonMods, props => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
