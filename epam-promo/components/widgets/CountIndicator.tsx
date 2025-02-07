import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type CountIndicatorMods = Pick<uui.CountIndicatorProps, 'size'> & {
    /** Defines component color. */
    color: 'gray' | 'white' | 'blue' | 'green' | 'amber' | 'red' | uui.CountIndicatorProps['color'];
};

/** Represents the properties of a CountIndicator component. */
export type CountIndicatorProps = uui.CountIndicatorCoreProps & CountIndicatorMods;

export const CountIndicator = createSkinComponent<uui.CountIndicatorProps, CountIndicatorProps>(uui.CountIndicator);
