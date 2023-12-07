import { devLogger, createSkinComponent } from '@epam/uui-core';
import * as uui from '@epam/uui';

export type MultiSwitchColor = 'sky' | 'night600' | 'gray';

export interface MultiSwitchMods {
    /**
     * @default 'sky'
     */
    color?: MultiSwitchColor;
}

export type MultiSwitchProps<TValue> = uui.MultiSwitchCoreProps<TValue> & MultiSwitchMods;

export const MultiSwitch = createSkinComponent<uui.MultiSwitchProps<any>, MultiSwitchProps<any>>(
    uui.MultiSwitch,
    (props) => {
        const validColor = props.color === 'night600' ? 'gray' : props.color;

        if (__DEV__) {
            devLogger.warnAboutDeprecatedPropValue<MultiSwitchProps<any>, 'color'>({
                component: 'MultiSwitch',
                propName: 'color',
                propValue: props.color,
                propValueUseInstead: 'gray',
                condition: () => ['night600'].indexOf(props.color) !== -1,
            });
        }
        return {
            color: validColor || 'sky',
        };
    },
);
