import { withMods } from '@epam/uui-core';
import * as UuiComponents from '@epam/uui-components';
import css from './Tooltip.module.scss';

export type TooltipMods = {
    /**
     * Tooltip color
     * @default 'inverted'
     */
    color?: 'neutral' | 'inverted' | 'critical';
};

export type TooltipCoreProps = UuiComponents.TooltipProps;

export type TooltipProps = TooltipCoreProps & TooltipMods;

function applyTooltipMods(mods: TooltipMods) {
    return [
        css.root,
        `uui-color-${mods.color || 'inverted'}`,
    ];
}

export const Tooltip = withMods<TooltipProps, TooltipMods>(UuiComponents.Tooltip, applyTooltipMods);
