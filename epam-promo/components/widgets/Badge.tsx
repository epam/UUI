import { ButtonCoreProps, createSkinComponent, devLogger } from '@epam/uui-core';
import { BadgeProps as UuiBadgeProps, Badge as UuiBadge, BadgeMods as UuiBadgeMods } from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

export interface BadgeMods extends Omit<UuiBadgeProps, 'color' | 'fill'> {
    /** @default 'blue' */
    color?: EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint' | 'white' | 'gray10'| 'gray30'| 'gray60';
    /** @default 'solid' */
    fill?: UuiBadgeMods['fill'] | 'semitransparent';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css.root,
    ];
}

export type BadgeProps = ButtonCoreProps & BadgeMods;

export const Badge = createSkinComponent<UuiBadgeProps, BadgeProps>(
    UuiBadge,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'fill'>({
                component: 'Badge',
                propName: 'fill',
                propValue: props.fill,
                propValueUseInstead: 'outline',
                condition: () => ['semitransparent'].indexOf(props.fill) !== -1,
            });
        }
        return {
            color: props.color || 'blue',
            fill: props.fill === 'semitransparent' ? 'outline' : (props.fill || 'solid'),
        };
    },
    applyBadgeMods,
);
