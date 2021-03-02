import * as types from '../../components/types';
import * as css from './Badge.scss';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import * as buttonCss from '../buttons/Button.scss';
import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';

export interface BadgeMods extends types.ColorMod, types.FontMod {
    shape?: types.ControlShape;
    fill?: types.FillStyle;
    size?: '12' | '18';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        buttonCss.root,
        buttonCss['font-' + (mods.font || 'sans-semibold')],
        css['style-' + (mods.shape || 'square')],
        css['size-' + (mods.size || '18')],
        css['fill-' + (mods.fill || 'solid')],
        styles['color-' + (mods.color || 'sky')],
        css.root,
    ];
}

export const Badge = withMods<ButtonProps, BadgeMods>(Button, applyBadgeMods);
