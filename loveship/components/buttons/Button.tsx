import { FillStyle, ControlShape, EpamPrimaryColor } from '../types';
import { Button as uuiButton, ButtonFill, ButtonProps as UuiButtonProps, ControlSize } from '@epam/uui';
import { devLogger, withMods } from '@epam/uui-core';
import { systemIcons } from '../icons/icons';
import css from './Button.module.scss';

const defaultSize = '36';

export type ButtonColorType = EpamPrimaryColor | 'white' | 'night500' | 'night600' | 'gray';

export interface ButtonMods {
    color?: ButtonColorType;
    size?: ControlSize | '42' | '18';
    shape?: ControlShape;
    fill?: FillStyle;
}

const mapFill: Record<FillStyle, ButtonFill> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

export type ButtonProps = Omit<UuiButtonProps, 'color' | 'fill'> & ButtonMods;

export function applyButtonMods(mods: ButtonProps) {
    return [
        css['size-' + (mods.size || defaultSize)],
        css['style-' + (mods.shape || 'square')],
    ];
}

export const Button = withMods<Omit<UuiButtonProps, 'color' | 'fill'>, ButtonMods>(
    uuiButton,
    applyButtonMods,
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
            dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
            clearIcon: systemIcons[props.size || defaultSize].clear,
            fill: mapFill[props.fill] || mapFill.solid,
        };
    },
);
