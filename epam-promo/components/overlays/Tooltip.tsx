import { withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui';

export interface TooltipMods {
    /**
     * Tooltip color.
     * Note that 'gray90' is deprecated and will be removed in future versions, please use 'gray' instead.
     */
    color?: 'white' | 'gray90' | 'gray' | 'red';
}

export type TooltipProps = Omit<UuiTooltipProps, 'color'> & TooltipMods;

export const Tooltip = withMods<Omit<UuiTooltipProps, 'color'>, TooltipMods>(
    uuiTooltip,
    () => [],
    (props) => ({
        color: props.color === 'gray90' ? 'gray' : props.color ?? 'gray',
    } as TooltipProps),
);
