import { Button as uuiButton } from '@epam/uui';
import type * as UuiTypes from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { FillStyle } from '../types';
import css from './Button.module.scss';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50' | 'gray';

export interface ButtonMods {
    fill?: FillStyle;
    color?: ButtonColor;
}

const mapFillToMod: Record<FillStyle, UuiTypes.ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiTypes.ButtonProps, 'color'> & ButtonMods;

export const Button = withMods<Omit<UuiTypes.ButtonProps, 'color'>, ButtonMods>(
    uuiButton,
    (props) => [
        ['42', '48'].includes(props.size) && css.uppercase,
    ],
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
            mode: mapFillToMod[props.fill] || mapFillToMod.solid,
        };
    },
);
