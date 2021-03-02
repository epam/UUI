import * as React from 'react';
import { withMods } from '@epam/uui';
import { VirtualList as uuiVirtualList, VirtualListProps } from '@epam/uui-components';
import * as css from './VirtualList.scss';

export interface VirtualListMods {
    shadow?: 'dark' | 'white' | false;
}

function applyVirtualListMods(mods: VirtualListMods) {
    return [
        css.root,
        mods.shadow && css['shadow-' + (mods.shadow || 'dark')],
    ];
}

export const VirtualList = withMods<VirtualListProps, VirtualListMods>(uuiVirtualList, applyVirtualListMods);
