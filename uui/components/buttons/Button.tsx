import * as uuiComponents from '@epam/uui-components';
import { withMods, Overwrite } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import { settings } from '../../settings';
import css from './Button.module.scss';

type ButtonMods = {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | ControlSize | '60';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline' | 'ghost' | 'none';
    /**
     * Defines component color.
     * @default 'primary'
     */
    color?: 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral' | 'white';
};
export interface ButtonModsOverride {}

/** Represents the 'Core properties' for the Button component. */
export type ButtonCoreProps = uuiComponents.ButtonProps;

/** Represents the props for a Button component. */
export interface ButtonProps extends ButtonCoreProps, Overwrite<ButtonMods, ButtonModsOverride> {}

function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        `uui-size-${mods.size || settings.sizes.defaults.button}`,
    ];
}

export const Button = withMods<uuiComponents.ButtonProps, ButtonProps>(
    uuiComponents.Button,
    applyButtonMods,
    () => {
        return {
            dropdownIcon: systemIcons.foldingArrow,
            clearIcon: systemIcons.clear,
        };
    },
);
