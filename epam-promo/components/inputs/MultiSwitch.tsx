import { devLogger, createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type MultiSwitchColor = 'blue' | 'gray50' | 'gray';

export interface MultiSwitchMods {
    /**
     * @default 'blue'
     */
    color?: MultiSwitchColor;
}

export type MultiSwitchProps<TValue> = uui.MultiSwitchCoreProps<TValue> & MultiSwitchMods;

export const MultiSwitch = createSkinComponent<uui.MultiSwitchProps<any>, MultiSwitchProps<any>>(
    uui.MultiSwitch,
    (props) => {
        const validColor = props.color === 'gray50' ? 'gray' : props.color;

        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<MultiSwitchProps<any>, 'color'>({
                component: 'MultiSwitch',
                propName: 'color',
                propValue: props.color,
                propValueUseInstead: 'gray',
                condition: () => ['gray50'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: validColor || 'blue',
        };
    },
);
