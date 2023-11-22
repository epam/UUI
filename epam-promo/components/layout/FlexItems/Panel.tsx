import { Panel as uuiPanel } from '@epam/uui';
import { withMods, VPanelProps } from '@epam/uui-core';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'white' | 'gray90';
}
export interface PanelProps extends VPanelProps, PanelMods {}

export const Panel = withMods<VPanelProps, PanelMods>(uuiPanel, (props) => [props.background && `uui-color-${props.background}`]);
