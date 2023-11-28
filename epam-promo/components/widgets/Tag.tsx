import { createSkinComponent } from '@epam/uui-core';
import { Tag as UuiTag, TagCoreProps as UuiTagCoreProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type TagMods = {
    /**
     * @default 'gray30'
     */
    color?: EpamPrimaryColor | 'blue' | 'white' | 'gray10' | 'gray30' | 'gray70';
};

export type TagProps = UuiTagCoreProps & TagMods;

export const Tag = createSkinComponent<UuiTagCoreProps, TagMods>(UuiTag);
