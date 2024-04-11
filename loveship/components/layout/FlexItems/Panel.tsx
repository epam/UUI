import { Panel as uuiPanel } from '@epam/uui';
import { withMods, VPanelProps } from '@epam/uui-core';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'white' | 'night50';
}

export interface PanelProps extends VPanelProps, PanelMods {}

export const Panel = /* @__PURE__ */withMods<VPanelProps, PanelMods>(
    uuiPanel,
    (props) => [props.background && `uui-color-${props.background}`],
);
