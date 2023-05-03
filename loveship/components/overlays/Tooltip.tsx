import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui';

export interface TooltipMods {
    /**
     * Tooltip color.
     * Note that 'night900' is deprecated and will be removed in future versions, please use 'gray' instead.
     */
    color?: 'white' | 'fire' | 'gray' | 'night900';
}

export type TooltipProps = Omit<UuiTooltipProps, 'color'> & TooltipMods;

export const Tooltip = withMods< Omit<UuiTooltipProps, 'color'>, TooltipMods>(
    uuiTooltip,
    () => [],
    (props) => ({
        color: props.color === 'night900' ? 'gray' : props.color ?? 'gray',
    } as TooltipProps),
);
