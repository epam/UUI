import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = {
    /**
     * @default 'gray30'
     */
    color?: EpamPrimaryColor | 'white' | 'gray10' | 'gray30' | 'gray70';
};

export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagProps, TagProps>(
    uui.Tag,
    (props) => ({ color: props.color || 'gray30' }),
);
