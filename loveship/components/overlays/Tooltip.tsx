import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui';

export interface TooltipMods {
    /**
     * Tooltip color
     * Note that 'night900' is deprecated and will be removed in future versions, please use 'night800' instead.
     */
    color?: 'white' | 'fire' | 'night800' | 'night900';
}

export type TooltipProps = Omit<UuiTooltipProps, 'color'> & TooltipMods;

export const Tooltip = withMods< Omit<UuiTooltipProps, 'color'>, TooltipMods>(
    uuiTooltip,
    () => [],
    (props) => ({
        color: props.color === 'night900' ? 'night800' : props.color ?? 'night800',
    } as TooltipProps),
);
