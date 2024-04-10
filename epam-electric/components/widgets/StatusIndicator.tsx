import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface StatusIndicatorMods {
    /**
     * Defines component color.
     * @default 'neutral'
     */
    color?: uui.StatusIndicatorProps['color'] | 'white' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
}

/** Represents the properties of a StatusIndicator component. */
export interface StatusIndicatorProps extends uui.StatusIndicatorCoreProps, StatusIndicatorMods {}

export const StatusIndicator = /* @__PURE__ */createSkinComponent<uui.StatusIndicatorProps, StatusIndicatorProps>(
    uui.StatusIndicator,
    (props) => ({ color: props.color || 'neutral' }),
);
