import { withMods } from '@epam/uui-core';
import { VirtualList as uuiVirtualList, VirtualListProps } from '@epam/uui-components';
import css from './VirtualList.module.scss';

export interface VirtualListMods {}

function applyVirtualListMods(mods: VirtualListMods) {
    return [css.root];
}

export const VirtualList = withMods<VirtualListProps, VirtualListMods>(uuiVirtualList, applyVirtualListMods);
