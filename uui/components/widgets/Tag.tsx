import React from 'react';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Tag.module.scss';

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

const mapCountIndicatorSizes: Record<TagSize, CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

export interface TagMods {
    size?: TagSize;
}

export function applyTagMods(mods: TagMods) {
    return [
        css['size-' + (mods.size || defaultSize)],
        css.root,
        'uui-color-neutral',
        'uui-tag',
    ];
}

export type TagProps = ButtonProps & TagMods;

export const Tag = withMods<ButtonProps, TagMods>(Button, applyTagMods, (props) => ({
    dropdownIcon: systemIcons[mapSize[props.size] || defaultSize].foldingArrow,
    clearIcon: systemIcons[mapSize[props.size] || defaultSize].clear,
    countIndicator: (countIndicatorProps) => (
        <CountIndicator
            { ...countIndicatorProps }
            color="white"
            size={ mapCountIndicatorSizes[props.size || defaultSize] }
        />
    ),
}));
