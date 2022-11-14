import { Button as uuiButton, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ButtonMode } from '../../types';
import { getIcon } from '../../../icons';
import * as css from './Button.scss';
import './Button.colorvars.scss';
import { uuiComponentClass } from '../../constant';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allButtonColors: ButtonColor[] = ['accent', 'primary', 'secondary', 'negative'];

export interface ButtonMods {
    size?: string;
    mode?: ButtonMode;
    color?: ButtonColor;
}

export type UUIButtonProps = ButtonMods & ButtonProps;

export function applyButtonMods(mods: UUIButtonProps) {
    return [
        uuiComponentClass.button,
        mods.size && `uui-size-${mods.size}`,
        `button-color-${mods.color || 'primary'}`,
        css.root,
        css[`mode-${mods.mode || 'solid'}`],
    ];
}

export const Button = withMods<ButtonProps, ButtonMods>(
    uuiButton,
    applyButtonMods,
    () => ({
        dropdownIcon: getIcon('foldingArrow'),
        clearIcon: getIcon('clear'),
    }),
);