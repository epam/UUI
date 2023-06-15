import { withMods, devLogger } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui';

export interface TooltipMods {
    /** Tooltip color.
     *  'night900' is deprecated and will be removed in future release, use 'gray' instead.
     * */
    color?: 'white' | 'fire' | 'gray' | 'night900';
}

export type TooltipProps = Omit<UuiTooltipProps, 'color'> & TooltipMods;

export const Tooltip = withMods<Omit<UuiTooltipProps, 'color'>, TooltipMods>(
    uuiTooltip,
    () => [],
    (props) => {
        devLogger.warnAboutDeprecatedPropValue<TooltipProps, 'color'>({
            propName: 'color',
            propValue: props.color,
            propValueUseInstead: 'gray',
            condition: () => ['night900'].indexOf(props.color) !== -1,
        });
        return {
            color: (!props.color || props.color === 'night900') ? 'gray' : props.color,
        } as TooltipProps;
    },
);
