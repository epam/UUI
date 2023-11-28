import { createSkinComponent } from '@epam/uui-core';
import { Tag as UuiTag, TagCoreProps as UuiTagCoreProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = {
    /**
     * @default 'night300'
     */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700';
};

export type TagProps = UuiTagCoreProps & TagMods;

export const Tag = createSkinComponent<UuiTagCoreProps, TagMods>(UuiTag);
