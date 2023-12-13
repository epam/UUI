import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type StatusIndicatorMods = {
    /** Defines component color.
     * @default 'gray'
     */
    color?: uui.StatusIndicatorColors | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

/** Represents the properties of a StatusIndicator component. */
export type StatusIndicatorProps = uui.StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<uui.StatusIndicatorProps, StatusIndicatorProps>(
    uui.StatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
