import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as types from '../../components/types';
import * as uui from '@epam/uui';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

const defaultSize = '18';

type BadgeColor = EpamPrimaryColor | EpamAdditionalColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white'
| 'night100' | 'night300' | 'night600' | uui.BadgeProps['color'];

type BadgeMods = {
    /**
     * TDefines component color.
     * @default 'sky'
     */
    color?: BadgeColor
    /**
     * Defines component shape.
     * @default 'square'
     */
    shape?: types.ControlShape;
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeProps['fill'] | 'semitransparent';
    /**
     * Defines component size.
     * @default '18'
     */
    size?: uui.BadgeProps['size'] | '12';
};

function applyBadgeMods(mods: BadgeMods) {
    return [
        css['style-' + (mods.shape || 'square')],
        css[`fill-${mods.fill === 'semitransparent' ? 'outline' : (mods.fill || 'solid')}`],
        css['size-' + (mods.size || defaultSize)],
        css.root,
    ];
}

/** Represents the properties of a Badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(
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
            color: props.color || 'sky',
            size: props.size || defaultSize,
            fill: props.fill === 'semitransparent' ? 'outline' : (props.fill || 'solid'),
        };
    },
    applyBadgeMods,
);
