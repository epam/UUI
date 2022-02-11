import { withMods } from '@epam/uui';
import { VirtualList as uuiVirtualList, VirtualListProps } from '@epam/uui-components';
import './VirtualList.scss';
import '../../assets/styles/variables/layout/scrollBars.scss';

export interface VirtualListMods {
}

function applyVirtualListMods() {
    return [
        'scroll-bars-vars',
    ];
}

export const VirtualList = withMods<VirtualListProps, VirtualListMods>(uuiVirtualList, applyVirtualListMods);
