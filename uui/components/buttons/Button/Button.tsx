import { Button as uuiButton, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, ButtonMode } from '../../types';
import { systemIcons } from '../../../icons/icons';
import css from './Button.scss';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allButtonColors: ButtonColor[] = ['accent', 'primary', 'secondary', 'negative'];

const defaultSize = '36';

export interface ButtonMods {
    size?: ControlSize | '18';
    mode?: ButtonMode;
    color?: ButtonColor;
}

export type UUIButtonProps = ButtonMods & ButtonProps;

export function applyButtonMods(mods: UUIButtonProps) {
    return [
        'button-vars',
        `button-${mods.color || 'primary'}`,
        css.root,
        css[`size-${mods.size || defaultSize}`],
        css[`mode-${mods.mode || 'solid'}`],
    ];
}

export const Button = withMods<ButtonProps, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
    }),
);
