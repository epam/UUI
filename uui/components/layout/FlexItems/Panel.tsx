import { withMods, VPanelProps } from '@epam/uui-core';
import { VPanel } from '@epam/uui-components';
import '../../../assets/styles/variables/layout/panel.scss';
import css from './Panel.scss';

export interface PanelMods {
    shadow?: boolean;
    margin?: '24';
    background?: boolean;
}

export const Panel = withMods<VPanelProps, PanelMods>(VPanel, props => [
    'panel-vars',
    css.root,
    props.shadow && css.shadow,
    props.background && css.background,
    props.margin && css['margin-' + props.margin],
]);
