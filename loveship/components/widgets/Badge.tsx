import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as types from '../../components/types';
import * as uui from '@epam/uui';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

const defaultSize = '18';

export type BadgeMods = {
    /** @default 'sky' */
    color?: EpamPrimaryColor | EpamAdditionalColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night300' | 'night600';
    /** @default 'square' */
    shape?: types.ControlShape;
    /** @default 'solid' */
    fill?: uui.BadgeMods['fill'] | 'semitransparent';
    /** @default '18' */
    size?: uui.BadgeMods['size'] | '12';
};

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css['style-' + (mods.shape || 'square')],
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css['size-' + (mods.size || defaultSize)],
        css.root,
    ];
}

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
            color: props.color || 'sky',
            size: props.size || defaultSize,
            fill: props.fill === 'semitransparent' ? 'outline' : (props.fill || 'solid'),
        };
    },
    applyBadgeMods,
);
