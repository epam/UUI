import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui-components';
import css from './Tooltip.module.scss';

export interface TooltipMods {
    /**
     * Tooltip color
     * @default 'contrast'
     */
    color?: 'neutral' | 'contrast' | 'critical';
}

export type TooltipProps = UuiTooltipProps & TooltipMods;

function applyTooltipMods(mods: TooltipMods) {
    return [
        css.root,
        `uui-color-${mods.color || 'contrast'}`,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(uuiTooltip, applyTooltipMods);
