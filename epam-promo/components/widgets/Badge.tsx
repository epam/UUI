import { withMods } from "@epam/uui-core";
import { BadgeProps as UuiBadgeProps, Badge as UuiBadge } from "@epam/uui";
import { EpamAdditionalColor } from "../types";

export interface BadgeMods {
    color?: EpamAdditionalColor | 'gray30';
}

export const applyBadgeMods = () => [
    'uui-theme-promo',
];

export type BadgeProps = Omit<UuiBadgeProps, "color"> & BadgeMods;

export const Badge = withMods<Omit<UuiBadgeProps, "color">, BadgeMods>(
    UuiBadge,
    applyBadgeMods,
    (props) => ({
        color: props.color || 'blue',
    } as BadgeProps),
);
