import { Button as uuiButton, ButtonProps as UuiButtonProps, ButtonMode } from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { FillStyle } from '../types';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50' | 'gray';

export interface ButtonMods {
    fill?: FillStyle;
    color?: ButtonColor;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiButtonProps, 'color'> & ButtonMods;

export const Button = withMods<Omit<UuiButtonProps, 'color'>, ButtonMods>(
    uuiButton,
    () => [],
    (props) => {
        devLogger.warnAboutDeprecatedPropValue<ButtonProps, 'color'>({
            propName: 'color',
            propValue: props.color,
            propValueUseInstead: 'gray',
            condition: () => ['gray50'].indexOf(props.color) !== -1,
        });
        return {
            mode: mapFillToMod[props.fill] || mapFillToMod.solid,
        };
    },
);
