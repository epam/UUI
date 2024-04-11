import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

type BadgeColor = EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint'
| 'white' | 'gray10'| 'gray30'| 'gray60' | uui.BadgeProps['color'];

type BadgeMods = {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: BadgeColor
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeProps['fill'] | 'semitransparent';
    /**
     * Defines component size.
     * @default 36
     */
    size?: uui.BadgeProps['size'];
};

function applyBadgeMods(mods: BadgeMods) {
    return [
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css.root,
    ];
}

/** Represents the properties of a badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = /* @__PURE__ */createSkinComponent<uui.BadgeProps, BadgeProps>(
    uui.Badge as any, // TODO: remove it when BaseButton inheritance will be reworked
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
