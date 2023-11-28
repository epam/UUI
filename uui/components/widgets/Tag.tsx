import React from 'react';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Tag.module.scss';
import { SemanticColor } from '../types';

const defaultSize = '36';

const mapSize = {
    48: '48',
    42: '48',
    36: '36',
    30: '30',
    24: '30',
    18: '18',
};

export type TagSize = '18' | '24' | '30' | '36' | '42' | '48';
export type TagFill = 'solid' | 'outline';

const mapCountIndicatorSizes: Record<TagSize, CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

export type TagMods = {
    /** @default 'neutral' */
    color?: SemanticColor;
};

export type TagCoreProps = ButtonProps & {
    /** @default '36' */
    size?: TagSize;
    /** @default 'solid' */
    fill?: TagFill;
};

export type TagProps = TagCoreProps & TagMods;

export function applyTagMods(mods: TagProps) {
    return [
        css['size-' + (mods.size || defaultSize)],
        css.root,
        `uui-color-${mods.color || 'neutral'}`,
        `uui-fill-${mods.fill || 'solid'}`,
        'uui-tag',
    ];
}

export const Tag = withMods<TagCoreProps, TagMods>(Button, applyTagMods, (props) => ({
    dropdownIcon: systemIcons[mapSize[props.size] || defaultSize].foldingArrow,
    clearIcon: systemIcons[mapSize[props.size] || defaultSize].clear,
    countIndicator: (countIndicatorProps) => (
        <CountIndicator
            { ...countIndicatorProps }
            color={ (!props.color || props.color === 'neutral') ? 'white' : props.color }
            size={ mapCountIndicatorSizes[props.size || defaultSize] }
        />
    ),
}));
