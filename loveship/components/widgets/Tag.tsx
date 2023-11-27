import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = uui.TagCoreProps & {
    /**
     * @default 'night300'
     */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700';
};

export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagCoreProps, TagMods>(
    uui.Tag,
    (props) => ({
        color: props.color || 'night300',
    }),
);
