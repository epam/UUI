import { Button as uuiButton, ButtonProps as UuiButtonProps, ButtonMode } from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { FillStyle } from '../types';

export type ButtonColor = 'blue' | 'green' | 'red' | 'gray50' | 'gray';

export interface ButtonMods {
    fill?: FillStyle;
    /** Button color.
     * Note that 'gray50' is deprecated and will be removed in future versions, please use 'gray' instead.
     * */
    color?: ButtonColor;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiButtonProps, 'color'> & ButtonMods;

function warnAboutDeprecatedColor(actualColor: ButtonColor, deprecated: ButtonColor[], useInstead: ButtonColor) {
    if (deprecated.indexOf(actualColor) !== -1) {
        devLogger.warn(`Button color '${actualColor}' is deprecated and will be removed in future versions, please use '${useInstead}' instead.`);
    }
}

export const Button = withMods<Omit<UuiButtonProps, 'color'>, ButtonMods>(
    uuiButton,
    () => [],
    (props) => {
        warnAboutDeprecatedColor(props.color, ['gray50'], 'gray');
        return {
            mode: mapFillToMod[props.fill] || mapFillToMod.solid,
        };
    },
);
