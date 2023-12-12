import React from 'react';
import { devLogger, withMods } from '@epam/uui-core';
import { Button, ButtonProps } from '@epam/uui-components';
import { CountIndicator, CountIndicatorProps } from './CountIndicator';
import { systemIcons } from '../../icons/icons';
import css from './Badge.module.scss';

const mapSize = {
    48: '48',
    42: '48',
    36: '36',
    30: '30',
    24: '30',
    18: '18',
};

export const defaultBadgeSize = '36';
export const defaultBadgeFill = 'solid';

export type BadgeMods = {
    /** Defines component color. */
    color?: 'info' | 'success' | 'warning' | 'critical' | 'neutral';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: 'solid' | 'outline';
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
};

export type BadgeCoreProps = ButtonProps & {
    /** Defines a boolean flag to display an indicator. */
    indicator?: boolean;
};

/** Represents the properties of a Badge component. */
export type BadgeProps = BadgeCoreProps & BadgeMods;

export function applyBadgeMods(mods: BadgeProps) {
    return [
        'uui-badge',
        css.root,
        css['size-' + (mods.size || defaultBadgeSize)],
        `uui-fill-${mods.fill || defaultBadgeFill}`,
        mods.color && `uui-color-${mods.color}`,
        mods.indicator && 'uui-indicator',
    ];
}

const mapCountIndicatorSizes: Record<BadgeMods['size'], CountIndicatorProps['size']> = {
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
};

export const Badge = withMods<BadgeCoreProps, BadgeMods>(Button, applyBadgeMods, (props) => {
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
        dropdownIcon: systemIcons[(props.size && mapSize[props.size]) || defaultBadgeSize].foldingArrow,
        clearIcon: systemIcons[(props.size && mapSize[props.size]) || defaultBadgeSize].clear,
        countPosition: 'left',
        countIndicator: (countIndicatorProps) => (
            <CountIndicator
                { ...countIndicatorProps }
                color={ null }
                size={ mapCountIndicatorSizes[props.size || defaultBadgeSize] }
            />
        ),
        indicator: props.indicator || false,
    };
});
