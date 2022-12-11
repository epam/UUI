import { Button, ButtonProps } from '@epam/uui-components';
import { withMods } from '@epam/uui-core';
import { systemIcons } from '../icons/icons';
import * as types from '../../components/types';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import buttonCss from '../buttons/Button.scss';
import css from './Tag.scss';

export type TagSize = '18' | '24' | '30' | '36' | '42' | '48';

const mapSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

const defaultSize = '18';

export interface TagMods extends types.ColorMod {
    fill?: types.FillStyle;
    size?: TagSize;
}

export function applyTagMods(mods: TagMods & ButtonProps) {
    return [
        buttonCss.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
        styles['color-' + (mods.color || 'sky')],
        css.root,
    ];
}

export const Tag = withMods<ButtonProps, TagMods>(Button, applyTagMods, (props) => ({
    dropdownIcon: systemIcons[mapSize[props.size || defaultSize]].foldingArrow,
    clearIcon: systemIcons[mapSize[props.size || defaultSize]].clear,
    countPosition: 'left',
}));
