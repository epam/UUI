import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';
import { FillStyle } from '../types';
import css from './Button.module.scss';

/** Defines component color. */
type ButtonColor = 'blue' | 'green' | 'red' | 'gray' | uui.ButtonProps['color'];

type ButtonMods = {
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: FillStyle;
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: ButtonColor;
    /**
     * Defines component size.
     * @default '36'
     */
    size?: uui.ButtonProps['size'];
};

const mapFill: Record<FillStyle, uui.ButtonProps['fill']> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

/** Represents the properties of a Button component. */
export type ButtonProps = uui.ButtonCoreProps & ButtonMods;

export const Button = createSkinComponent<uui.ButtonProps, ButtonProps>(
    uui.Button,
    (props) => {
        return {
            fill: mapFill[props.fill] || mapFill.solid,
        } as any; // TODO: need new helper to rewrite types
    },
    (props) => [
        ['42', '48'].includes(props.size) && css.uppercase,
    ],
);
