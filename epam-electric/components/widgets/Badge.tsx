import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type BadgeMods = {
    /** @default 'neutral' */
    color?: uui.BadgeColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night600';
    /** @default 'solid' */
    fill?: uui.BadgeFill;
    /** @default '36' */
    size?: uui.BadgeSize;
};

export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(uui.Badge);
