import { withMods, VPanelProps } from '@epam/uui-core';
import { VPanel } from '@epam/uui-components';
import css from './Panel.module.scss';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: 'surface';
}

export type PanelProps = VPanelProps & PanelMods;

export const Panel = withMods<VPanelProps, PanelMods>(VPanel, (props) => [
    'uui-panel',
    css.root,
    props.shadow && css.shadow,
    props.margin && css['margin-' + props.margin],
    props.background && `uui-color-${props.background}`,
]);
