import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps } from '@epam/uui-components';
import css from './Tooltip.scss';
import styles from '../../assets/styles/colorvars/overlays/tooltip-colorvars.scss';

export interface TooltipMods {
    /** Tooltip color */
    color?: 'white' | 'gray90' | 'red';
}

function applyTooltipMods(mods: TooltipMods) {
    return [css.root, styles['color-' + (mods.color || 'gray90')]];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
