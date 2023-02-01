import { withMods } from '@epam/uui-core';
import { Tag as UuiTag, TagProps, TagMods as UuiTagMods } from '@epam/uui';

export interface TagMods extends UuiTagMods {}

export function applyTagMods() {
    return [
        'uui-theme-promo',
    ];
}

export const Tag = withMods<TagProps, TagMods>(UuiTag, applyTagMods);
