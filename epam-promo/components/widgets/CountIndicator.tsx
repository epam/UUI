import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type CountIndicatorMods = {
    /** Defines component color. */
    color: 'gray' | 'white' | 'blue' | 'green' | 'amber' | 'red' | uui.CountIndicatorProps['color'];
};

/** Represents the properties of a CountIndicator component. */
export type CountIndicatorProps = uui.CountIndicatorCoreProps & CountIndicatorMods;

export const CountIndicator = /* @__PURE__ */createSkinComponent<uui.CountIndicatorProps, CountIndicatorProps>(uui.CountIndicator);
