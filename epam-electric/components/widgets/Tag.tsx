import { createSkinComponent } from '@epam/uui-core';
import { Tag as UuiTag, TagCoreProps as UuiTagCoreProps, TagColor as UuiTagColor } from '@epam/uui';

export type TagMods = {
    /** @default 'neutral' */
    color?: UuiTagColor | 'white' | 'night100' | 'night700';
};

export type TagProps = UuiTagCoreProps & TagMods;

export const Tag = createSkinComponent<UuiTagCoreProps, TagProps>(UuiTag);
