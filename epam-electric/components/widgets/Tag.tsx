import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type TagMods = {
    /** @default 'neutral' */
    color?: uui.TagColor | 'white' | 'night100' | 'night700';
};

export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(uui.Tag);
