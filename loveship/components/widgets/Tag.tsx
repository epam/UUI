import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

type TagMods = {
    /**
     * Defines component color.
     * @default 'night300'
     */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700' | uui.TagProps['color'];
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
};

/** Represents the properties of a Tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(
    uui.Tag,
    (props) => ({ color: props.color || 'night300' }),
);
