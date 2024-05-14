import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamAdditionalColor, EpamPrimaryColor } from '../types';

const DEFAULT_SIZE = '18';

type BadgeColor = EpamPrimaryColor | EpamAdditionalColor | 'yellow'| 'orange' | 'purple' | 'cyan' | 'mint' | 'white'
| 'night100' | 'night300' | 'night600' | uui.BadgeProps['color'];

interface BadgeMods {
    /**
     * Defines component color.
     * @default 'sky'
     */
    color?: BadgeColor
    /**
     * Defines component fill style.
     * @default 'solid'
     */
    fill?: uui.BadgeProps['fill'];
    /**
     * Defines component size.
     * @default '18'
     */
    size?: uui.BadgeProps['size'];
}

/** Represents the properties of a Badge component. */
export type BadgeProps = uui.BadgeCoreProps & BadgeMods;

export const Badge = createSkinComponent<uui.BadgeProps, BadgeProps>(
    uui.Badge,
    (props) => {
        return {
            color: props.color || 'sky',
            size: props.size || DEFAULT_SIZE,
            fill: props.fill || 'solid',
        };
    },
);
