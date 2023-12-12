import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

export type BadgeMods = {
    /**
     * The color of an element.
     * @default 'blue'
     */
    color?: EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint' | 'white' | 'gray10'| 'gray30'| 'gray60';
    /**
     * The fill property of the Badge component.
     * @default 'solid'
     */
    fill?: uui.BadgeMods['fill'] | 'semitransparent';
    /**
     * Represents the size of a badge.
     * @default 36
     */
    size?: uui.BadgeMods['size'];
};

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css.root,
    ];
}

/**
 * Represents the properties of a badge component.
 */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(
    uui.Badge,
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
