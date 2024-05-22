import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface TooltipMods {
    /**
     * Defines component color.
     * @default 'gray'
     */
    color?: 'white' | 'fire' | 'gray' | uui.TooltipProps['color'];
}

/** Represents the properties of the Tooltip component. */
export interface TooltipProps extends uui.TooltipCoreProps, TooltipMods {}

export const Tooltip = createSkinComponent<uui.TooltipProps, TooltipProps>(uui.Tooltip);
