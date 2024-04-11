import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

type TagMods = {
    /**
     * Defines component color.
     * @default 'night300'
     */
    color?: EpamPrimaryColor | 'white' | 'night100' | 'night300' | 'night700' | uui.TagProps['color'];
};

/** Represents the properties of a Tag component. */
export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = /* @__PURE__ */createSkinComponent<uui.TagProps, TagProps>(
    uui.Tag,
    (props) => ({ color: props.color || 'night300' }),
);
