import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type BadgeMods = {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: uui.BadgeMods['color'] | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white' | 'night100' | 'night600';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeMods['fill'];
    /**
     * Defines component size.
     * @default '36'
     */
    size?: uui.BadgeMods['size'];
};

/** Represents the properties of a Badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(uui.Badge);
