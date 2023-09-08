import { Panel as uuiPanel } from '@epam/uui';
import { withMods, VPanelProps } from '@epam/uui-core';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'white' | 'gray90';
}

export const Panel = withMods<VPanelProps, PanelMods>(uuiPanel, (props) => [`uui-color-${props.background || 'none'}`]);
