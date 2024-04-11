import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

type StatusIndicatorMods = {
    /**
     * Defines component color.
     * @default 'gray'
     */
    color?: EpamPrimaryColor | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint' | uui.StatusIndicatorProps['color'];
};

/** Represents the properties of a StatusIndicator component. */
export type StatusIndicatorProps = uui.StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = /* @__PURE__ */createSkinComponent<uui.StatusIndicatorProps, StatusIndicatorProps>(
    uui.StatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
