import { devLogger, createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface TooltipMods {
    /**
     * Defines component color.
     * @default 'gray'
     */
    color?: 'white' | 'gray90' | 'gray' | 'red' | uui.TooltipProps['color'];
}

/** Represents the properties of a Tooltip component. */
export interface TooltipProps extends uui.TooltipCoreProps, TooltipMods {}

export const Tooltip = /* @__PURE__ */createSkinComponent<uui.TooltipProps, TooltipProps>(
    uui.Tooltip,
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
