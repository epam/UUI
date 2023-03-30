import { withMods } from "@epam/uui-core";
import { BadgeProps as UuiBadgeProps, Badge as UuiBadge } from "@epam/uui";
import { EpamAdditionalColor } from "../types";

export interface BadgeMods {
    color?: EpamAdditionalColor | 'gray30';
}

export type BadgeProps = Omit<UuiBadgeProps, "color"> & BadgeMods;

export const Badge = withMods<Omit<UuiBadgeProps, "color">, BadgeMods>(
    UuiBadge,
    () => [],
    (props) => ({
        color: props.color || 'blue',
    } as BadgeProps),
);
