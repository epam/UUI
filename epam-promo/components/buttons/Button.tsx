import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import { FillStyle } from '../types';
import css from './Button.module.scss';

/** Defines component color. */
type ButtonColor = 'blue' | 'green' | 'red' | 'gray50' | 'gray' | uui.ButtonProps['color'];

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

export const Button = /* @__PURE__ */createSkinComponent<uui.ButtonProps, ButtonProps>(
    uui.Button as any, // TODO: remove it when BaseButton inheritance will be reworked
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<ButtonProps, 'color'>({
                component: 'Button',
                propName: 'color',
                propValue: props.color,
                propValueUseInstead: 'gray',
                condition: () => ['gray50'].indexOf(props.color) !== -1,
            });
        }
        return {
            fill: mapFill[props.fill] || mapFill.solid,
        } as any; // TODO: need new helper to rewrite types
    },
    (props) => [
        ['42', '48'].includes(props.size) && css.uppercase,
    ],
);
