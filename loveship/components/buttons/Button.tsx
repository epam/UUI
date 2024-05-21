import { ControlShape, EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';
import { createSkinComponent } from '@epam/uui-core';
import css from './Button.module.scss';

const defaultSize = '36';

type FillStyle = 'solid' | 'white' | 'light' | 'none';

/** Defines component color. */
type ButtonColor = EpamPrimaryColor | 'gray' | uui.ButtonProps['color'];

type ButtonMods = {
    /**
     * Defines component color.
     * @default "sky"
     */
    color?: ButtonColor;
    /**
     * Defines component size.
     * @default '36'
     */
    size?: uui.ButtonProps['size'] | '18';
    /**
     * Defines component shape.
     * @default 'square'
     */
    shape?: ControlShape;
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: FillStyle;
};

const mapFill: Record<FillStyle, uui.ButtonProps['fill']> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

/** Represents the properties of a Button component. */
export type ButtonProps = uui.ButtonCoreProps & ButtonMods;

function applyButtonMods(mods: ButtonProps) {
    return [
        `uui-size-${mods.size || defaultSize}`,
        css['style-' + (mods.shape || 'square')],
    ];
}

export const Button = createSkinComponent<uui.ButtonProps, ButtonProps>(
    uui.Button,
    (props) => {
        return {
            fill: mapFill[props.fill] || mapFill.solid as any,
        };
    },
    applyButtonMods,
);
