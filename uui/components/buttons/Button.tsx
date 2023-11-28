import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import { CountIndicator } from '../widgets';
import css from './Button.module.scss';

const defaultSize = '36';
export type ButtonColors = 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral';
export type ButtonFill = 'solid' | 'outline' | 'ghost' | 'none';

export interface ButtonMods {
    size?: ControlSize | '18';
    fill?: ButtonFill;
    color?: ButtonColors;
}

export type ButtonCoreProps = uuiButtonProps & {
    size?: ControlSize | '18';
};

export type ButtonProps = ButtonMods & Omit<uuiButtonProps, 'count' | 'indicator'>;

export function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        `uui-size-${mods.size || defaultSize}`,
    ];
}

export const Button = withMods<uuiButtonProps, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
        countIndicator: (countIndicatorProps) => <CountIndicator { ...countIndicatorProps } color="white" />,
    }),
);
