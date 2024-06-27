import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type TagMods = {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: uui.TagProps['color'] | 'white' | 'night100' | 'night700';
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
};

/** Represents the properties of a Tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(uui.Tag);
