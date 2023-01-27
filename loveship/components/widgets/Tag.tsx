import { withMods } from '@epam/uui-core';
import { Tag as UuiTag, TagProps, TagMods as UuiTagMods } from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.scss';

const defaultSize = '18';

export interface TagMods extends UuiTagMods {
    fill?: types.FillStyle;
    color?: types.EpamColor;
}

export function applyTagMods(mods: TagMods & Omit<TagProps, 'color'>) {
    return [
        'uui-theme-loveship',
        css.root,
        css['size-' + (mods.size || defaultSize)],
    ];
}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(UuiTag, applyTagMods,
    (props) => ({
        size: props.size || defaultSize,
    }),
);
