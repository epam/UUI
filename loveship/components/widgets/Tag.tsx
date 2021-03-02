import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui';
import { systemIcons } from '../icons/icons';
import * as types from '../../components/types';
import * as styles from '../../assets/styles/scss/loveship-color-vars.scss';
import * as buttonCss from '../buttons/Button.scss';
import * as css from './Tag.scss';

export type TagSize = '18' | '24' | '30' | '36';

export interface TagMods extends types.ColorMod, types.FontMod {
    fill?: types.FillStyle;
    size?: TagSize;
}

export function applyTagMods(mods: TagMods & ButtonProps) {
    return [
        buttonCss.root,
        buttonCss['font-' + (mods.font || 'sans-semibold')],
        css['size-' + (mods.size || '18')],
        css['fill-' + (mods.fill || 'solid')],
        styles['color-' + (mods.color || 'sky')],
        css.root,
    ];
}

export const Tag = withMods<ButtonProps, TagMods>(Button, applyTagMods, () => ({
    clearIcon: systemIcons['30'].clear,
    countPosition: 'left',
}));
