import { FillStyle, ControlShape, EpamPrimaryColor } from '../types';
import { Button as uuiButton, ButtonMode, ButtonProps as UuiButtonProps, ControlSize } from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { systemIcons } from '../icons/icons';
import css from './Button.scss';

const defaultSize = '36';

export type ButtonColorType = EpamPrimaryColor | 'white' | 'night500' | 'night600' | 'gray';

export interface ButtonMods {
    /** Button color.
     * Note that 'night500' and ''night600' is deprecated and will be removed in future versions, please use 'gray' instead.
     * */
    color?: ButtonColorType;
    size?: ControlSize | '42' | '18';
    shape?: ControlShape;
    fill?: FillStyle;
}

const mapFillToMod: Record<FillStyle, ButtonMode> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiButtonProps, 'color'> & ButtonMods;

export function applyButtonMods(mods: ButtonProps) {
    return [
        css['size-' + (mods.size || defaultSize)],
        css['style-' + (mods.shape || 'square')],
    ];
}

function warnAboutDeprecatedColor(actualColor: ButtonColorType, deprecated: ButtonColorType[], useInstead: ButtonColorType) {
    if (deprecated.indexOf(actualColor) !== -1) {
        devLogger.warn(`Button color '${actualColor}' is deprecated and will be removed in future versions, please use '${useInstead}' instead.`);
    }
}

export const Button = withMods<Omit<UuiButtonProps, 'color'>, ButtonMods>(uuiButton, applyButtonMods, (props) => {
    warnAboutDeprecatedColor(props.color, ['night500', 'night600'], 'gray');
    return {
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
        mode: mapFillToMod[props.fill] || mapFillToMod.solid,
    };
});
