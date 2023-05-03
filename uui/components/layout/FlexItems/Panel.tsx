import { withMods, VPanelProps } from '@epam/uui-core';
import { VPanel } from '@epam/uui-components';
import css from './Panel.scss';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
}

export const Panel = withMods<VPanelProps, PanelMods>(VPanel, (props) => [
    'uui-panel', css.root, props.shadow && css.shadow, props.margin && css['margin-' + props.margin],
]);
