import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.module.scss';

const defaultSize = '18';

export type TagMods = uui.TagMods & {
    /**
     * @default 'solid'
     */
    fill?: types.FillStyle;
};

export function applyTagMods(mods: TagMods) {
    return [css.root, css['fill-' + (mods.fill || 'solid')]];
}
export type TagProps = uui.TagProps & TagMods;

export const Tag = createSkinComponent<TagProps, TagMods>(uui.Tag, (props) => ({
    size: props.size || defaultSize,
}), applyTagMods);
