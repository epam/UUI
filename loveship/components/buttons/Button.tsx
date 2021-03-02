import * as types from '../types';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import * as css from './Button.scss';
import { withMods } from '@epam/uui';
import { Button as uuiButton, ButtonProps } from '@epam/uui-components';
import { TextSettings, getTextClasses } from '../../helpers/textLayout';
import { systemIcons } from '../icons/icons';

const defaultSize = '36';

export interface ButtonMods extends types.ColorMod, TextSettings {
    size?: types.ControlSize | '42' | '18';
    shape?: types.ControlShape;
    fill?: types.FillStyle;
}

export function applyButtonMods(mods: ButtonMods & ButtonProps) {
    return [
        css.root,
        css['size-' + (mods.size || defaultSize)],
        styles['color-' + (mods.color || 'sky')],
        css['fill-' + (mods.fill || 'solid')],
        css['style-' + (mods.shape || 'square')],
    ];
}

export const Button = withMods<ButtonProps, ButtonMods>(
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