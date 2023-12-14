import { withMods, devLogger } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface TooltipMods {
    /**
     * Tooltip color.
     * 'night900' is deprecated and will be removed in future release, use 'gray' instead.
     *
     * @default 'gray'
     */
    color?: 'white' | 'fire' | 'gray' | 'night900' | uui.TooltipProps['color'];
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
                condition: () => ['night900'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: (!props.color || props.color === 'night900') ? 'gray' : props.color,
        } as TooltipProps;
    },
);
