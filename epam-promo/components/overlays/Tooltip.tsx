import { withMods } from '@epam/uui';
import { Tooltip as uuiTooltip, TooltipProps } from '@epam/uui-components';
import * as css from './Tooltip.scss';
import * as styles from '../../assets/styles/colorvars/overlays/tooltip-colorvars.scss';

export interface TooltipMods {
    color?: 'white' | 'gray90';
}

function applyTooltipMods(mods: TooltipMods) {
    return [
        css.root,
        styles['color-' + (mods.color || 'gray90')],
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);