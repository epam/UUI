import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

interface TooltipMods {
    /**
     * Defines component color.
     * @default 'gray'
     */
    color?: 'white' | 'gray' | 'red' | uui.TooltipProps['color'];
}

/** Represents the properties of a Tooltip component. */
export interface TooltipProps extends uui.TooltipCoreProps, TooltipMods {}

export const Tooltip = createSkinComponent<uui.TooltipProps, TooltipProps>(uui.Tooltip);
