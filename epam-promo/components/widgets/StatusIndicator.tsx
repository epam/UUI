import { createSkinComponent } from '@epam/uui-core';
import { StatusIndicator as UuiStatusIndicator, StatusIndicatorCoreProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export type StatusIndicatorMods = {
    /** @default 'gray' */
    color?: EpamPrimaryColor | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

export type StatusIndicatorProps = StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<StatusIndicatorCoreProps, StatusIndicatorProps>(
    UuiStatusIndicator,
    (props) => ({ color: props.color || 'gray' }),
);
