import { createSkinComponent } from '@epam/uui-core';
import { TagProps, TagMods as UuiTagMods, Button } from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.module.scss';

const defaultSize = '18';

export type TagMods = UuiTagMods & {
    fill?: types.FillStyle;
};

export function applyTagMods(mods: TagMods) {
    return [css.root, css['fill-' + (mods.fill || 'solid')]];
}

export const Tag = createSkinComponent<TagProps, TagMods>(Button, applyTagMods, (props) => ({
    size: props.size || defaultSize,
}));
