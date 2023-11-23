import React from 'react';
import { EpamBadgeSemanticColor } from '../types';
import { devLogger, withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
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
export type BadgeFill = 'solid' | 'outline';
export type BadgeSize = '18' | '24' | '30' | '36' | '42' | '48';

export interface BadgeMods {
    color?: BadgeColor;
    /** @default 'solid' */
    fill?: BadgeFill;
    /** @default '36' */
    size?: BadgeSize;
    indicator?: boolean;
}

export type BadgeProps = ButtonProps & BadgeMods;

export function applyBadgeMods(mods: BadgeMods) {
    return [
        'uui-badge',
        css.root,
        css['size-' + (mods.size || defaultSize)],
        `uui-fill-${mods.fill || 'solid'}`,
        mods.color && `uui-color-${mods.color}`,
        mods.indicator && 'uui-indicator',
    ];
}

const mapCountIndicatorSizes: Record<BadgeSize, CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

export const Badge = withMods<ButtonProps, BadgeMods>(Button, applyBadgeMods, (props) => {
    if (__DEV__) {
        devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'size'>({
            component: 'Badge',
            propName: 'size',
            propValue: props.size,
            propValueUseInstead: '42',
            condition: () => ['48'].indexOf(props.size) !== -1,
        });
    }
    return {
        dropdownIcon: systemIcons[(props.size && mapSize[props.size]) || defaultSize].foldingArrow,
        clearIcon: systemIcons[(props.size && mapSize[props.size]) || defaultSize].clear,
        countPosition: 'left',
        countIndicator: (countIndicatorProps) => (
            <CountIndicator
                { ...countIndicatorProps }
                color={ null }
                size={ mapCountIndicatorSizes[props.size || defaultSize] }
            />
        ),
        indicator: props.indicator || false,
    };
});
