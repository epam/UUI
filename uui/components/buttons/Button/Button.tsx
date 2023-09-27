import * as uuiComponents from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, ButtonMode } from '../../types';
import { systemIcons } from '../../../icons/icons';
import css from './Button.module.scss';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allButtonColors: ButtonColor[] = [
    'accent', 'primary', 'secondary', 'negative',
];

const defaultSize = '36';

export interface ButtonMods {
    size?: ControlSize | '18';
    mode?: ButtonMode;
    color?: ButtonColor;
}

export type ButtonProps = ButtonMods & uuiComponents.ButtonProps;

export function applyButtonMods(mods: ButtonProps) {
    return [
        `button-${mods.color || 'primary'}`,
        css.root,
        css[`size-${mods.size || defaultSize}`],
        css[`mode-${mods.mode || 'solid'}`],
    ];
}

export const Button = withMods<uuiComponents.ButtonProps, ButtonMods>(uuiComponents.Button, applyButtonMods, (props) => ({
    dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
    clearIcon: systemIcons[props.size || defaultSize].clear,
}));
