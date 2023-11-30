import { createSkinComponent } from '@epam/uui-core';
import { Badge as UuiBadge, BadgeFill as UuiBadgeFill, BadgeSize as UuiBadgeSize, BadgeColor as UuiBadgeColor, BadgeCoreProps as UuiBadgeCoreProps, BadgeProps as UuiBadgeProps } from '@epam/uui';

export type BadgeMods = {
    /** @default 'neutral' */
    color?: UuiBadgeColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night600';
    /** @default 'solid' */
    fill?: UuiBadgeFill;
    /** @default '36' */
    size?: UuiBadgeSize;
};

export type BadgeProps = UuiBadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<UuiBadgeProps, BadgeProps>(UuiBadge);
