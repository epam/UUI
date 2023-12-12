import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type StatusIndicatorMods = {
    /** Represents the color of a status indicator.
     * @default 'gray'
     */
    color?: uui.StatusIndicatorColors | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

export type StatusIndicatorProps = uui.StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<uui.StatusIndicatorProps, StatusIndicatorProps>(
    uui.StatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
