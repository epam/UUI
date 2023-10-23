import { createSkinComponent } from '@epam/uui-core';
import { Badge as UuiBadge, BadgeProps as UuiBadgeProps, ButtonCoreProps, BadgeFill } from '@epam/uui';
import { EpamAdditionalColor } from '../types';

export type BadgeMods = {
    color?: EpamAdditionalColor | 'gray30';
    fill?: BadgeFill;
};

export type BadgeProps = ButtonCoreProps & BadgeMods;

export const Badge = createSkinComponent<UuiBadgeProps, BadgeProps>(
    UuiBadge,
    () => [],
    (props) =>
        ({
            color: props.color || 'blue',
        }),
);
