import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type TagMods = {
    /**
     * The color property of a Tag component.
     * @default 'neutral'
     */
    color?: uui.TagColor | 'white' | 'night100' | 'night700';
};

/** Represents the properties of a tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(uui.Tag);
