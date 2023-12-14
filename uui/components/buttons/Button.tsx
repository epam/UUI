import React from 'react';
import { Button as uuiButton, ButtonProps as uuiButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import { CountIndicator } from '../widgets/CountIndicator';
import css from './Button.module.scss';

const defaultSize = '36';

export type ButtonMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: ControlSize | '18';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline' | 'ghost' | 'none';
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral';
};

/** Represents the 'Core properties' for the Button component, omitting the 'count' property. */
export type ButtonCoreProps = Omit<uuiButtonProps, 'count'> & {};

/** Represents the props for a Button component. */
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
