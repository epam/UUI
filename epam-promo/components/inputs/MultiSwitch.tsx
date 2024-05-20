import { createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

type MultiSwitchMods = {
    /**
     * Defines component color.
     * @default 'blue'
     */
    color?: 'blue' | 'gray50' | 'gray' | uui.MultiSwitchProps['color'];
};

/** Represents the properties for the MultiSwitch component. */
export type MultiSwitchProps<TValue> = uui.MultiSwitchCoreProps<TValue> & MultiSwitchMods;

export const MultiSwitch = createSkinComponent<uui.MultiSwitchProps<any>, MultiSwitchProps<any>>(
    uui.MultiSwitch,
    (props) => {
        return {
            color: props.color || 'blue',
        };
    },
);
