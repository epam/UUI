import { withMods } from '@epam/uui-core';
import { CountIndicatorProps as UuiCountIndicatorProps, CountIndicator as UuiCountIndicator } from '@epam/uui';

export interface CountIndicatorMods {
    color: 'gray' | 'white' | 'sky' | 'grass' | 'sun' | 'fire' | null;
}

export type CountIndicatorProps = Omit<UuiCountIndicatorProps, 'color'> & CountIndicatorMods;

export const CountIndicator = withMods<Omit<UuiCountIndicatorProps, 'color'>, CountIndicatorMods>(
    UuiCountIndicator as any, // TODO: rework after new withMods implementation.
    () => [],
    (props): CountIndicatorProps => ({
        color: props.color,
    }),
);
