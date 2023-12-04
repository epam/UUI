import { createSkinComponent } from '@epam/uui-core';
import { StatusIndicator as UuiStatusIndicator, StatusIndicatorColors, StatusIndicatorCoreProps } from '@epam/uui';

export type StatusIndicatorMods = {
    /** @default 'gray' */
    color?: StatusIndicatorColors | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

export type StatusIndicatorProps = StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<StatusIndicatorCoreProps, StatusIndicatorProps>(
    UuiStatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
