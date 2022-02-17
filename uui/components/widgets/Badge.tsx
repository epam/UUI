import * as React from 'react';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import * as buttonCss from '../buttons/Button.scss';
import * as css from './Badge.scss';
import '../../assets/styles/variables/widgets/badge.scss';

const defaultSize = '36';

const mapSize = {
    '48': '48',
    '42': '48',
    '36': '36',
    '30': '30',
    '24': '30',
    '18': '18',
};

export type BadgeColor = 'info' | 'success' | 'warning' | 'error';
export type BadgeFill = 'solid';
export type BadgeSize = '18' | '24' | '30' | '36' | '42' | '48';

export interface BadgeMods {
    fill?: BadgeFill;
    size?: BadgeSize;
    color?: BadgeColor;
}

export interface BadgeProps extends ButtonProps, BadgeMods {}

export function applyBadgeMods(mods: BadgeMods) {
    return [

        `badge-color-${(mods.color || 'info')}`,
        buttonCss.root,
        css['size-' + (mods.size || defaultSize)],
        css['fill-' + (mods.fill || 'solid')],
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