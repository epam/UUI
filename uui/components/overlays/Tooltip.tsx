import { Overwrite, withMods } from '@epam/uui-core';
import * as uuiComponents from '@epam/uui-components';
import css from './Tooltip.module.scss';

interface TooltipMods {
    /**
     * Tooltip color
     * @default 'inverted'
     */
    color?: 'neutral' | 'inverted' | 'critical';
}

export interface TooltipCoreProps extends uuiComponents.TooltipProps {}

export interface TooltipModsOverride {}

export interface TooltipProps extends TooltipCoreProps, Overwrite<TooltipMods, TooltipModsOverride> {}

function applyTooltipMods(mods: TooltipMods) {
    return [
        css.root,
        `uui-color-${mods.color || 'inverted'}`,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipProps>(uuiComponents.Tooltip, applyTooltipMods);
