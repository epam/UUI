import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export interface CountIndicatorMods {
    /**
     * The color options available for a specific element. Property is required
     */
    color: 'gray' | 'white' | 'sky' | 'grass' | 'sun' | 'fire';
}

export type CountIndicatorProps = uui.CountIndicatorCoreProps & CountIndicatorMods;

export const CountIndicator = createSkinComponent<uui.CountIndicatorProps, CountIndicatorProps>(uui.CountIndicator);
