import { createSkinComponent, devLogger } from '@epam/uui-core';
import { Badge as UuiBadge, BadgeMods as UuiBadgeMods, BadgeCoreProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

export type BadgeMods = {
    /** @default 'blue' */
    color?: EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint' | 'white' | 'gray10'| 'gray30'| 'gray60';
    /** @default 'solid' */
    fill?: UuiBadgeMods['fill'] | 'semitransparent';
    /** @default '36' */
    size?: UuiBadgeMods['size'];
};

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css.root,
    ];
}

export type BadgeProps = BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<BadgeCoreProps, BadgeProps>(
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
