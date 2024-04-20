import { FillStyle, ControlShape, EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import css from './Button.module.scss';

const defaultSize = '36';

/** Defines component color. */
type ButtonColor = EpamPrimaryColor | 'night500' | 'night600' | 'gray' | uui.ButtonProps['color'];

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
    uui.Button as any, // TODO: remove it when BaseButton inheritance will be reworked
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<ButtonProps, 'color'>({
                component: 'Button',
                propName: 'color',
                propValue: props.color,
                propValueUseInstead: 'gray',
                condition: () => ['night500', 'night600'].indexOf(props.color) !== -1,
            });
        }
        return {
            fill: mapFill[props.fill] || mapFill.solid as any,
        };
    },
    applyButtonMods,
);
