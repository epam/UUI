import * as uuiComponents from '@epam/uui-components';
import { withMods, Overwrite } from '@epam/uui-core';
import { ControlSize } from '../types';
import { systemIcons } from '../../icons/icons';
import css from './Button.module.scss';

const DEFAULT_SIZE = '36';

type ButtonMods = {
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
    color?: 'accent' | 'primary' | 'critical' | 'secondary' | 'neutral' | 'white';
};
export interface ButtonModsOverride {}

/** Represents the 'Core properties' for the Button component. */
export type ButtonCoreProps = uuiComponents.ButtonProps;

/** Represents the props for a Button component. */
export type ButtonProps = ButtonCoreProps & Overwrite<ButtonMods, ButtonModsOverride>;

function applyButtonMods(mods: ButtonProps) {
    return [
        css.root,
        'uui-button',
        `uui-fill-${mods.fill || 'solid'}`,
        `uui-color-${mods.color || 'primary'}`,
        `uui-size-${mods.size || DEFAULT_SIZE}`,
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
