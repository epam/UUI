import * as uui from '@epam/uui';
import { withMods, VPanelProps } from '@epam/uui-core';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'white' | 'gray90' | uui.PanelProps['background'];
}

export interface PanelProps extends VPanelProps, PanelMods {}

export const Panel = /* @__PURE__ */withMods<VPanelProps, PanelMods>(uui.Panel, (props) => [props.background && `uui-color-${props.background}`]);
