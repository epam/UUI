import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

type BadgeColor = EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint'
| 'white' | 'gray10'| 'gray30'| 'gray60' | uui.BadgeProps['color'];

type BadgeMods = {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: BadgeColor
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeProps['fill'];
    /**
     * Defines component size.
     * @default 36
     */
    size?: uui.BadgeProps['size'];
};

/** Represents the properties of a badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(
    uui.Badge,
    (props) => {
        return {
            color: props.color || 'blue',
            fill: props.fill || 'solid',
        };
    },
);
