import { Button as uuiButton, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { ControlSize, FillStyle } from '../types';
import { systemIcons } from '../../icons/icons';
import * as css from './Button.scss';
import * as styles from '../../assets/styles/colorvars/buttons/button-colorvars.scss';

export type ButtonColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allButtonColors: ButtonColor[] = ['accent', 'primary', 'secondary', 'negative'];

const defaultSize = '36';

export interface ButtonMods {
    size?: ControlSize | '18';
    fill?: FillStyle;
    color?: ButtonColor;
}

export function applyButtonMods(mods: ButtonMods & ButtonProps) {
    return [
        styles['button-color-' + (mods.color || 'primary')],
        css.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
    ];
}

export const Button = withMods<ButtonProps, ButtonMods>(
    uuiButton,
    applyButtonMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size || defaultSize].clear,
    }),
);