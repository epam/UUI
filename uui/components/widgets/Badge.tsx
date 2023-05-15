import * as React from 'react';
import { EpamBadgeSemanticColor } from '../types';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { systemIcons } from '../../icons/icons';
import buttonCss from '../buttons/Button/Button.module.scss';
import css from './Badge.module.scss';

const defaultSize = '36';

const mapSize = {
    48: '48',
    42: '48',
    36: '36',
    30: '30',
    24: '30',
    18: '18',
};
export type BadgeColor = EpamBadgeSemanticColor;
export type BadgeFill = 'solid' | 'semitransparent' | 'transparent';
export type BadgeSize = '18' | '24' | '30' | '36' | '42' | '48';

export interface BadgeMods {
    color?: BadgeColor;
    fill?: BadgeFill;
    size?: BadgeSize;
}

export type BadgeProps = ButtonProps & BadgeMods;

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css.root, buttonCss.root, css['size-' + (mods.size || defaultSize)], css['fill-' + (mods.fill || 'solid')], mods.color && `badge-${mods.color}`,
    ];
}

export const Badge = withMods<ButtonProps, BadgeMods>(Button, applyBadgeMods, (props) => ({
    dropdownIcon: systemIcons[(props.size && mapSize[props.size]) || defaultSize].foldingArrow,
    clearIcon: systemIcons[(props.size && mapSize[props.size]) || defaultSize].clear,
    countPosition: 'left',
}));
