import * as React from 'react';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { EpamAdditionalColor } from '../types';
import { systemIcons } from '../../icons/icons';
import buttonCss from '../buttons/Button.scss';
import styles from '../../assets/styles/colorvars/widgets/badge-colorvars.scss';
import css from './Badge.scss';

const defaultSize = '36';

const mapSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

export interface BadgeMods {
    fill?: 'solid' | 'semitransparent' | 'transparent';
    size?: '18' | '24' | '30' | '36' | '42' | '48';
    color?: EpamAdditionalColor | 'gray30';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        buttonCss.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
        styles['badge-color-' + (mods.color || 'blue')],
        css.root,
    ];
}

export const Badge = withMods<ButtonProps, BadgeMods>(
    Button,
    applyBadgeMods,
    (props) => ({
        dropdownIcon: systemIcons[props.size && mapSize[props.size] || defaultSize].foldingArrow,
        clearIcon: systemIcons[props.size && mapSize[props.size] || defaultSize].clear,
        countPosition: 'left',
    }),
);
