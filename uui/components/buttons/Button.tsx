import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, ButtonFill } from '../types';
import { systemIcons } from '../../icons/icons';
import { Informer } from '../widgets';
import css from './Button.module.scss';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'critical';
export const allButtonColors: ButtonColor[] = [
    'accent', 'primary', 'secondary', 'critical',
];

const defaultSize = '36';

export interface ButtonMods {
    size?: ControlSize | '18';
    fill?: ButtonFill;
    color?: ButtonColor;
}

export type ButtonProps<PropType = ButtonMods> =
    (PropType extends ButtonMods ? ButtonMods : PropType) & uuiButtonProps;

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
    informer: (informerProps) => <Informer { ...informerProps } color="white" />,
}));
