import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type BadgeMods = {
    /**
     * Defines component color.
     * @default 'info'
     */
    color?: uui.BadgeProps['color'] | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'cobalt' | 'violet' | 'fuchsia' | 'white' | 'night100' | 'night600';
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeProps['fill'];
    /**
     * Defines component size.
     * @default '36'
     */
    size?: uui.BadgeProps['size'];
};

/** Represents the properties of a Badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = /* @__PURE__ */createSkinComponent<uui.BadgeProps, BadgeProps>(
    uui.Badge,
    (props) => ({
        color: props.color || 'info',
    }),
);
