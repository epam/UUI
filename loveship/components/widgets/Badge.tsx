import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../icons/icons';
import * as types from '../../components/types';
import styles from '../../assets/styles/scss/loveship-color-vars.scss';
import buttonCss from '../buttons/Button.scss';
import css from './Badge.scss';

const defaultSize = '18';

const mapSizeToIconSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
    '12': '18',
};

export interface BadgeMods extends types.ColorMod {
    /** Badge shape: square or round */
    shape?: types.ControlShape;
    /** Badge fill style */
    fill?: types.FillStyle  | 'semitransparent' | 'transparent';
    /** Badge size */
    size?: '12' | '18' | '24' | '30' | '36' | '42' | '48';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        buttonCss.root,
        css['style-' + (mods.shape || 'square')],
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
        styles['color-' + (mods.color || 'sky')],
        css.root,
    ];
}

export const Badge = withMods<ButtonProps, BadgeMods>(
    Button,
    applyBadgeMods,
    (props) => ({
        dropdownIcon: systemIcons[mapSizeToIconSize[props.size || defaultSize]].foldingArrow,
        clearIcon: systemIcons[mapSizeToIconSize[props.size || defaultSize]].clear,
        countPosition: 'left',
    }),
);
