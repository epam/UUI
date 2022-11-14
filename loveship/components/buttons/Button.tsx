import * as types from '../types';
import { Button as uuiButton, UUIButtonProps } from '@epam/uui';
import { withMods } from '@epam/uui-core';
import { TextSettings, getTextClasses } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';
import * as css from './Button.scss';

const defaultSize = '36';

export interface ButtonMods extends types.ColorMod, TextSettings {
    size?: types.ControlSize | '42' | '18';
    shape?: types.ControlShape;
    fill?: types.FillStyle;
}

export function applyButtonMods(mods: Omit<UUIButtonProps, "color"> & ButtonMods) {
    return [
        css['size-' + (mods.size || defaultSize)],
        'color-' + (mods.color || 'sky'),
    ];
}

export const Button = withMods<Omit<UUIButtonProps, "color">, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
        captionCX: getTextClasses({
            size: props.size || defaultSize,
            lineHeight: props.lineHeight,
            fontSize: props.fontSize,
        }, true),
    }),
);