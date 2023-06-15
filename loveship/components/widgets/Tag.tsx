import { withMods } from '@epam/uui-core';
import { Tag as UuiTag, TagProps, TagMods as UuiTagMods } from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.module.scss';

const defaultSize = '18';

export interface TagMods extends UuiTagMods {
    fill?: types.FillStyle;
}

export function applyTagMods(mods: TagMods) {
    return [css.root, css['fill-' + (mods.fill || 'solid')]];
}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(UuiTag, applyTagMods, (props) => ({
    size: props.size || defaultSize,
}));
