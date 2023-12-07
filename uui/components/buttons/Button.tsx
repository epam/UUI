import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import { CountIndicator } from '../widgets';
import css from './Button.module.scss';

const defaultSize = '36';
export type ButtonColor = 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral';
export type ButtonFill = 'solid' | 'outline' | 'ghost' | 'none';

export interface ButtonMods {
    /** @default '36' */
    size?: ControlSize | '18';
    /** @default 'solid' */
    fill?: ButtonFill;
    /** @default 'primary' */
    color?: ButtonColor;
}

export type ButtonCoreProps = Omit<uuiButtonProps, 'count'> & {};

export type ButtonProps = ButtonMods & ButtonCoreProps;

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
