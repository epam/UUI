import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps } from '@epam/uui-components';
import css from './Tooltip.scss';

export interface TooltipMods {
    color?: 'default' | 'contrast' | 'critical';
}

function applyTooltipMods(mods: TooltipMods) {
    return [
        `tooltip-${ mods.color }`,
        css.root,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
