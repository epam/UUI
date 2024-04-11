import { withMods, VPanelProps } from '@epam/uui-core';
import { VPanel } from '@epam/uui-components';
import css from './Panel.module.scss';

interface PanelMods {
    /*
    * Pass true to show a shadow.
    */
    shadow?: boolean;
    /*
    * Defines component margin.
    */
    margin?: '24';
    /*
    * Defines component background.
    */
    background?: 'surface-main';
}

/** Represents the properties of the Panel component. */
export type PanelProps = VPanelProps & PanelMods;

export const Panel = /* @__PURE__ */withMods<VPanelProps, PanelMods>(VPanel, (props) => [
    'uui-panel',
    css.root,
    props.shadow && css.shadow,
    props.margin && css['margin-' + props.margin],
    props.background && css[`uui-${props.background}`],
]);
