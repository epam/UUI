import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import { CountIndicator } from '../widgets';
import css from './Button.module.scss';

const defaultSize = '36';
/**
 * Represents the color of a button.
 */
export type ButtonColor = 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral';
/**
 * Represents the fill type for a button.
 */
export type ButtonFill = 'solid' | 'outline' | 'ghost' | 'none';

export interface ButtonMods {
    /**
     * The size of the control.
     * @default '36'
     */
    size?: ControlSize | '18';
    /**
     * The fill option for a button.
     * @default 'solid'
     */
    fill?: ButtonFill;
    /**
     * The color of a button.
     * @default 'primary'
     */
    color?: ButtonColor;
}

/**
 * Represents the properties for the ButtonCore component.
 * This type extends the uuiButtonProps type from the UUI library and omits the 'count' property.
 */
export type ButtonCoreProps = Omit<uuiButtonProps, 'count'> & {};

/**
 * Represents the props for a Button component.
 */
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
