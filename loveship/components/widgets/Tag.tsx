import { createSkinComponent } from '@epam/uui-core';
import { Tag as UuiTag, TagProps, TagMods as UuiTagMods } from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.module.scss';

const defaultSize = '18';

export type TagMods = UuiTagMods & {
    fill?: types.FillStyle;
};

export function applyTagMods(mods: TagMods) {
    return [css.root, css['fill-' + (mods.fill || 'solid')]];
}

export const Tag = createSkinComponent<TagProps, TagMods>(UuiTag, (props) => ({
    size: props.size || defaultSize,
}), applyTagMods);
