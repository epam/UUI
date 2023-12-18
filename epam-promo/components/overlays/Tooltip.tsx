import { devLogger, withMods } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface TooltipMods {
    /**
     * Tooltip color.
     * 'gray90' is deprecated and will be removed in future release, use 'gray' instead.
     * @default 'gray'
     */
    color?: 'white' | 'gray90' | 'gray' | 'red' | uui.TooltipProps['color'];
}

export type TooltipProps = Omit<uui.TooltipProps, 'color'> & TooltipMods;

export const Tooltip = withMods<Omit<uui.TooltipProps, 'color'>, TooltipMods>(
    uui.Tooltip,
    () => [],
    (props) => {
        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<TooltipProps, 'color'>({
                propName: 'color',
                propValue: props.color,
                propValueUseInstead: 'gray',
                condition: () => ['gray90'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: (!props.color || props.color === 'gray90') ? 'gray' : props.color,
        } as TooltipProps;
    },
);
