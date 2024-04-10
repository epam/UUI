import { withMods } from '@epam/uui-core';
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

export interface TooltipProps extends TooltipCoreProps, TooltipMods {}

function applyTooltipMods(mods: TooltipMods) {
    return [
        css.root,
        `uui-color-${mods.color || 'inverted'}`,
    ];
}

export const Tooltip = /* @__PURE__ */withMods<TooltipProps, TooltipMods>(uuiComponents.Tooltip, applyTooltipMods);
