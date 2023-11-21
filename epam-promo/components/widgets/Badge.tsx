import { devLogger, withMods } from '@epam/uui-core';
import { BadgeProps as UuiBadgeProps, Badge as UuiBadge, BadgeMods as UuiBadgeMods } from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

export interface BadgeMods extends Omit<UuiBadgeProps, 'color' | 'fill'> {
    /** @default 'blue' */
    color?: EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint' | 'white' | 'gray10'| 'gray30'| 'gray60';
    /** @default 'solid' */
    fill?: UuiBadgeMods['fill'] | 'semitransparent' | 'transparent';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css.root,
    ];
}

export type BadgeProps = Omit<UuiBadgeProps, 'color' | 'fill'> & BadgeMods;

export const Badge = withMods<Omit<UuiBadgeProps, 'color' | 'fill'>, BadgeMods>(
    UuiBadge,
    applyBadgeMods,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'fill'>({
                component: 'Badge',
                propName: 'fill',
                propValue: props.fill,
                condition: () => ['semitransparent', 'transparent'].indexOf(props.fill) !== -1,
            });
        }
        return {
            color: props.color || 'blue',
            fill: props.fill === 'semitransparent' ? 'outline' : (props.fill || 'solid'),
            indicator: props.fill === 'transparent' ? false : props.indicator,
        } as BadgeProps;
    },
);
