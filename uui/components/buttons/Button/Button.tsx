import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, ButtonFill } from '../../types';
import { systemIcons } from '../../../icons/icons';
import css from './Button.module.scss';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allButtonColors: ButtonColor[] = [
    'accent', 'primary', 'secondary', 'negative',
];

const defaultSize = '36';

export interface ButtonMods {
    size?: ControlSize | '18';
    fill?: ButtonFill;
    color?: ButtonColor;
}

export type ButtonProps = ButtonMods & uuiButtonProps;

export function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        css[`size-${mods.size || defaultSize}`],
    ];
}

export const Button = withMods<uuiButtonProps, ButtonMods>(uuiButton, applyButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
