import { devLogger, createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type TooltipMods = {
    /**
     * Tooltip color.
     * 'night900' is deprecated and will be removed in future release, use 'gray' instead.
     * @default 'gray'
     */
    color?: 'white' | 'fire' | 'gray' | 'night900';
};

export type TooltipProps = uui.TooltipCoreProps & TooltipMods;

export const Tooltip = createSkinComponent<uui.TooltipProps, TooltipProps>(
    uui.Tooltip,
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
