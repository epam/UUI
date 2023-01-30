import { withMods } from '@epam/uui-core';
import { Tag as UuiTag, TagProps, TagMods as UuiTagMods } from '@epam/uui';
import * as types from '../../components/types';

const defaultSize = '18';

export interface TagMods extends UuiTagMods {
    fill?: types.FillStyle;
    color?: types.EpamColor;
}

export function applyTagMods() {
    return [
        'uui-theme-loveship',
    ];
}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(UuiTag, applyTagMods,
    (props) => ({
        size: props.size || defaultSize,
    }),
);
