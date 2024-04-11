import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type TagMods = {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: uui.TagProps['color'] | 'white' | 'night100' | 'night700';
};

/** Represents the properties of a Tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = /* @__PURE__ */createSkinComponent<uui.TagProps, TagProps>(uui.Tag);
