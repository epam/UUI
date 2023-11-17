import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as types from '../../components/types';
import { Badge as UuiBadge, BadgeMods as UuiBadgeMods, BadgeProps as UuiBadgeProps } from '@epam/uui';
import css from './Badge.module.scss';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

const defaultSize = '18';

export interface BadgeMods extends Omit<UuiBadgeProps, 'color' | 'fill' | 'size'> {
    color?: EpamPrimaryColor | EpamAdditionalColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night300' | 'night600';
    shape?: types.ControlShape;
    fill?: UuiBadgeMods['fill'] | 'semitransparent';
    size?: UuiBadgeMods['size'] | '12';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css['style-' + (mods.shape || 'square')],
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css['size-' + (mods.size || defaultSize)],
        css.root,
    ];
}

export type BadgeProps = Omit<UuiBadgeProps, 'color' | 'fill' | 'size'> & BadgeMods;

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
            color: props.color || 'sky',
            size: props.size || defaultSize,
            fill: props.fill === 'semitransparent' ? 'outline' : (props.fill || 'solid'),
        } as BadgeProps;
    },
    applyBadgeMods,
);
