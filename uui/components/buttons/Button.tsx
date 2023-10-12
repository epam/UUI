import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize, ButtonFill } from '../types';
import { systemIcons } from '../../icons/icons';
import { CountIndicator } from '../widgets';
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

export type ButtonProps = ButtonMods & Omit<uuiButtonProps, 'count' | 'indicator'>;

export function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        css[`size-${mods.size || defaultSize}`],
    ];
}

export const Button = withMods<Omit<uuiButtonProps, 'count' | 'indicator'>, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
        countIndicator: (countIndicatorProps) => <CountIndicator { ...countIndicatorProps } color="white" />,
    }),
);
