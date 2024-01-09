import React from 'react';
import { devLogger, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import { CountIndicator } from './CountIndicator';
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

const DEFAULT_SIZE = '36';
const DEFAULT_FILL = 'solid';

type BadgeMods = {
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

export type BadgeCoreProps = Omit<uuiComponents.ButtonProps, 'onClear' | 'clearIcon' | 'iconPosition'> & {
    /** Pass true to display an indicator. It shows only if fill = 'outline'. */
    indicator?: boolean;
    /**
     * Position of the icon (left of right)
     * @default 'left'
     */
    iconPosition?: 'left' | 'right';
};

/** Represents the properties of a Badge component. */
export type BadgeProps = BadgeCoreProps & BadgeMods;

function applyBadgeMods(mods: BadgeProps) {
    return [
        'uui-badge',
        css.root,
        css['size-' + (mods.size || DEFAULT_SIZE)],
        `uui-fill-${mods.fill || DEFAULT_FILL}`,
        `uui-color-${mods.color || 'info'}`,
        mods.indicator && mods.fill === 'outline' && 'uui-indicator',
    ];
}

const mapCountIndicatorSizes = {
    12: '12',
    18: '12',
    24: '18',
    30: '18',
    36: '18',
    42: '24',
    48: '24',
} as const;

export const Badge = withMods<Omit<uuiComponents.ButtonProps, 'onClear' | 'clearIcon' | 'iconPosition'>, BadgeProps>(
    uuiComponents.Button as any,
    applyBadgeMods,
    (props) => {
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
            dropdownIcon: systemIcons[(props.size && mapSize[props.size]) || DEFAULT_SIZE].foldingArrow,
            clearIcon: systemIcons[(props.size && mapSize[props.size]) || DEFAULT_SIZE].clear,
            countPosition: 'left',
            countIndicator: (countIndicatorProps) => (
                <CountIndicator
                    { ...countIndicatorProps }
                    color={ null }
                    size={ mapCountIndicatorSizes[props.size || DEFAULT_SIZE] }
                />
            ),
            indicator: props.indicator || false,
            iconPosition: props.iconPosition || 'left',
        };
    },
);
