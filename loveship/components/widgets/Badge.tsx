import { createSkinComponent, devLogger } from '@epam/uui-core';
import * as types from '../../components/types';
import { BadgeProps as UuiBadgeProps, Badge as UuiBadge, BadgeMods as UuiBadgeMods, BadgeCoreProps } from '@epam/uui';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';
import css from './Badge.module.scss';

const defaultSize = '18';

export interface BadgeMods {
    color?: EpamPrimaryColor | EpamAdditionalColor | 'white' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600';
    shape?: types.ControlShape;
    fill?: UuiBadgeMods['fill'] | 'white' | 'light' | 'none';
    size?: BadgeCoreProps['size'] | '12';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [
        css['style-' + (mods.shape || 'square')], css['fill-' + (mods.fill || 'solid')], css['size-' + (mods.size || defaultSize)], css.root,
    ];
}

export type BadgeProps = Omit <BadgeCoreProps, 'size'> & BadgeMods;

export const Badge = createSkinComponent<UuiBadgeProps, BadgeProps>(
    UuiBadge,
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<BadgeProps, 'color'>({
                component: 'Badge',
                propName: 'color',
                propValue: props.color,
                condition: () => ['night200', 'night400', 'night500'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: props.color || 'sky',
            size: props.size || defaultSize,
        };
    },
    applyBadgeMods,
);
