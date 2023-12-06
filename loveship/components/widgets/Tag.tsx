import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = {
    /** @default 'night300' */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700';
};

export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(
    uui.Tag,
    (props) => ({ color: props.color || 'night300' }),
);
