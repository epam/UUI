import { withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';
import * as types from '../../components/types';
import css from './Tag.module.scss';

const defaultSize = '18';

export interface TagMods extends uui.TagMods {
    /**
     * @default 'solid'
     */
    fill?: types.FillStyle;
}

export function applyTagMods(mods: TagMods) {
    return [css.root, css['fill-' + (mods.fill || 'solid')]];
}

export interface TagProps extends Omit<uui.TagProps, 'color'>, TagMods {}

export const Tag = withMods<Omit<TagProps, 'color'>, TagMods>(uui.Tag, applyTagMods, (props) => ({
    size: props.size || defaultSize,
}));
