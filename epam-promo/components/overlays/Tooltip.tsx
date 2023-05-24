import { devLogger, withMods } from '@epam/uui-core';
import { Tooltip as uuiTooltip, TooltipProps as UuiTooltipProps } from '@epam/uui';

export interface TooltipMods {
    /** Tooltip color. */
    color?: 'white' | 'gray90' | 'gray' | 'red';
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
            condition: () => ['gray90'].indexOf(props.color) !== -1,
        });
        return {
            color: props.color === 'gray90' ? 'gray' : props.color,
        } as TooltipProps;
    },
);
