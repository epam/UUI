import { withMods } from '@epam/uui-core';
import { MultiSwitch as UuiMultiSwitch, UuiMultiSwitchColor, MultiSwitchProps as UuiMultiSwitchProps } from '@epam/uui';

export type MultiSwitchColor = 'sky' | 'night600';

export interface MultiSwitchMods {
    color?: MultiSwitchColor;
}

const colorToMod: Record<MultiSwitchColor, UuiMultiSwitchColor> = {
    sky: 'primary',
    night600: 'secondary',
};

export type MultiSwitchProps<TValue> = Omit<UuiMultiSwitchProps<TValue>, 'color'> & MultiSwitchMods;

export const MultiSwitch = withMods<UuiMultiSwitchProps<any>, MultiSwitchMods>(
    UuiMultiSwitch,
    () => [],
    (props) => ({
        color: colorToMod[props.color ?? 'sky'],
    }),
) as <TValue>(props: MultiSwitchProps<TValue>) => JSX.Element;
