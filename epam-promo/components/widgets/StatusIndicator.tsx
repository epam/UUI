import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type StatusIndicatorMods = {
    /**
     * The color variable of an element.
     * @default 'gray'
     */
    color?: EpamPrimaryColor | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

/** Represents the props for the StatusIndicator component. */
export type StatusIndicatorProps = uui.StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<uui.StatusIndicatorProps, StatusIndicatorProps>(
    uui.StatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
