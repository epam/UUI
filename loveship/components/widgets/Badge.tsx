import { withMods } from '@epam/uui-core';
import * as types from '../../components/types';
import { Badge as UuiBadge, BadgeMods as UuiBadgeMods, BadgeProps as UuiBadgeProps } from '@epam/uui';
import css from './Badge.scss';

const defaultSize = '18';

export interface BadgeMods {
    color?: types.EpamColor;
    shape?: types.ControlShape;
    fill?: UuiBadgeMods['fill'] | 'white' | 'light' | 'none';
    size?: UuiBadgeMods['size'] | '12';
}

export function applyBadgeMods(mods: BadgeMods) {
    return [css['style-' + (mods.shape || 'square')], css['fill-' + (mods.fill || 'solid')], css['size-' + (mods.size || defaultSize)], css.root];
}

export type BadgeProps = Omit<UuiBadgeProps, 'color' | 'fill' | 'size'> & BadgeMods;

export const Badge = withMods<Omit<UuiBadgeProps, 'color' | 'fill' | 'size'>, BadgeMods>(
    UuiBadge,
    applyBadgeMods,
    (props) =>
        ({
            color: props.color || 'sky',
            size: props.size || defaultSize,
        } as BadgeProps)
);
