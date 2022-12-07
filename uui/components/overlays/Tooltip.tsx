import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps } from '@epam/uui-components';
import '../../assets/styles/variables/overlays/tooltip.scss';
import css from './Tooltip.scss';

export interface TooltipMods {
}

function applyTooltipMods(mods: TooltipMods) {
    return [
        'tooltip-vars',
        css.root,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
