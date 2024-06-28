import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

type TagMods = {
    /**
     * Defines component color.
     * @default 'gray30'
     */
    color?: EpamPrimaryColor | 'white' | 'gray10' | 'gray30' | 'gray70' | uui.TagProps['color'];
    /**
     * Defines component size.
     * @default '36'
     */
    size?: '18' | '24' | '30' | '36' | '42' | '48';
};

/** Represents the properties for the Tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(
    uui.Tag,
    (props) => ({ color: props.color || 'gray30' }),
);
