import { createSkinComponent } from '@epam/uui-core';
import { StatusIndicator as UuiStatusIndicator, StatusIndicatorColors, StatusIndicatorCoreProps, StatusIndicatorProps as UuiStatusIndicatorProps } from '@epam/uui';

export type StatusIndicatorMods = {
    color?: StatusIndicatorColors | 'white' | 'gray' | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'violet' | 'cobalt' | 'cyan' | 'mint';
};

export type StatusIndicatorProps = StatusIndicatorCoreProps & StatusIndicatorMods;

export const StatusIndicator = createSkinComponent<UuiStatusIndicatorProps, StatusIndicatorMods>(UuiStatusIndicator);
