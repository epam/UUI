import { withMods } from '@epam/uui';
import { VirtualList as uuiVirtualList, VirtualListProps } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface VirtualListMods {
    shadow?: 'dark' | 'white';
}

function applyVirtualListMods(mods: VirtualListMods) {
    return [
        css.root,
        css['shadow-' + (mods.shadow || 'dark')],
    ];
}

export const VirtualList = withMods<VirtualListProps, VirtualListMods>(uuiVirtualList, applyVirtualListMods);
