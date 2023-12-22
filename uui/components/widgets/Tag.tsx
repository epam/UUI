import React from 'react';
import { withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Tag.module.scss';

const DEFAULT_SIZE = '36';

const mapSize = {
    48: '48',
    42: '48',
    36: '36',
    30: '30',
    24: '30',
    18: '18',
};

const mapCountIndicatorSizes: Record<TagCoreProps['size'], CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

interface TagMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: 'info' | 'success' | 'warning' | 'critical' | 'neutral';
}

/** Represents the Core properties of the Tag component. */
export type TagCoreProps = ButtonProps & {
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
};

/** Represents the properties of the Tag component. */
export type TagProps = TagCoreProps & TagMods;

function applyTagMods(props: TagProps) {
    return [
        css['size-' + (props.size || DEFAULT_SIZE)],
        css.root,
        `uui-color-${props.color || 'neutral'}`,
        `uui-fill-${props.fill || 'solid'}`,
        'uui-tag',
    ];
}

export const Tag = withMods<TagCoreProps, TagMods>(Button, applyTagMods, (props) => ({
    dropdownIcon: systemIcons[mapSize[props.size] || DEFAULT_SIZE].foldingArrow,
    clearIcon: systemIcons[mapSize[props.size] || DEFAULT_SIZE].clear,
    countIndicator: (countIndicatorProps) => (
        <CountIndicator
            { ...countIndicatorProps }
            color={ (!props.color || props.color === 'neutral') ? 'white' : props.color }
            size={ mapCountIndicatorSizes[props.size || DEFAULT_SIZE] }
        />
    ),
}));
