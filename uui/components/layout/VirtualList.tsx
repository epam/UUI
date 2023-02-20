import { withMods } from '@epam/uui-core';
import { VirtualList as uuiVirtualList, VirtualListProps } from '@epam/uui-components';
import '../../assets/styles/variables/layout/scrollBars.scss';
import './VirtualList.scss';

export interface VirtualListMods {}

function applyVirtualListMods() {
    return ['scroll-bars-vars'];
}

export const VirtualList = withMods<VirtualListProps, VirtualListMods>(uuiVirtualList, applyVirtualListMods);
