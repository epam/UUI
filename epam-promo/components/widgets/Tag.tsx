import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = uui.TagCoreProps & {
    /**
     * @default 'gray30'
     */
    color?: EpamPrimaryColor | 'blue' | 'white' | 'gray10' | 'gray30' | 'gray70';
};

export type TagProps = uui.TagCoreProps & TagMods;

export const Tag = createSkinComponent<uui.TagCoreProps, TagMods>(
    uui.Tag,
    (props) => ({
        color: props.color || 'gray30',
    }),
);
