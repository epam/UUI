import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import { FillStyle } from '../types';
import css from './Button.module.scss';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50' | 'gray';

export interface ButtonMods {
    /** @default 'solid' */
    fill?: FillStyle;
    /** @default 'blue' */
    color?: ButtonColor;
    /** @default '36' */
    size?: uui.ButtonMods['size'];
}

const mapFill: Record<FillStyle, uui.ButtonFill> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = uui.ButtonCoreProps & ButtonMods;

export const Button = createSkinComponent<uui.ButtonProps, ButtonProps>(
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
