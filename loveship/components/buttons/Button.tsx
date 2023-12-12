import { FillStyle, ControlShape, EpamPrimaryColor } from '../types';
import * as uui from '@epam/uui';
import { createSkinComponent, devLogger } from '@epam/uui-core';
import { systemIcons } from '../icons/icons';
import css from './Button.module.scss';

const defaultSize = '36';

/**
 * Represents the possible color types for a button.
 */
export type ButtonColorType = EpamPrimaryColor | 'white' | 'night500' | 'night600' | 'gray';

export interface ButtonMods {
    /**
     * The color of the button.
     * @default "sky"
     */
    color?: ButtonColorType;
    /**
     * The size of the control.
     * @default '36'
     */
    size?: uui.ControlSize | '18';
    /**
     * Control shape variable.
     * @default 'square'
     */
    shape?: ControlShape;
    /**
     * The fill style of a shape.
     * @default 'solid'
     */
    fill?: FillStyle;
}

const mapFill: Record<FillStyle, uui.ButtonFill> = {
    solid: 'solid',
    white: 'outline',
    light: 'ghost',
    none: 'none',
};

/** Represents the properties that can be passed to the Button component. */
export type ButtonProps = uui.ButtonCoreProps & ButtonMods;

export function applyButtonMods(mods: ButtonProps) {
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
            dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
            clearIcon: systemIcons[props.size || defaultSize].clear,
            fill: mapFill[props.fill] || mapFill.solid as any,
        };
    },
    applyButtonMods,
);
