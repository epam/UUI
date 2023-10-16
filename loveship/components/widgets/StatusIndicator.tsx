import { withMods } from '@epam/uui-core';
import { StatusIndicator as UuiStatusIndicator, StatusIndicatorProps as UuiStatusIndicatorProps } from '@epam/uui';
import { EpamPrimaryColor } from '../types';

export interface StatusIndicatorMods extends Omit<UuiStatusIndicatorProps, 'color'> {
    color?: EpamPrimaryColor | 'white' | 'night600' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
}

export type StatusIndicatorProps = Omit<UuiStatusIndicatorProps, 'color'> & StatusIndicatorMods;

export const StatusIndicator = withMods<Omit<UuiStatusIndicatorProps, 'color'>, StatusIndicatorMods>(
    UuiStatusIndicator,
    () => [],
    (props) => ({
        color: props.color || 'night600',
    } as StatusIndicatorProps),
);
