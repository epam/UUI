import { withMods } from '@epam/uui-core';
import { InformerProps as UuiInformerProps, Informer as UuiInformer } from '@epam/uui';

export interface InformerMods {
    color: 'gray' | 'white' | 'blue' | 'green' | 'amber' | 'red' | null;
}

export const InformerColors:InformerMods['color'][] = ['gray', 'white', 'blue', 'green', 'amber', 'red'];

export type InformerProps = Omit<UuiInformerProps, 'color'> & InformerMods;

export const Informer = withMods<Omit<UuiInformerProps, 'color'>, InformerMods>(
    UuiInformer as any, // TODO: rework after new withMods implementation.
    () => [],
    (props): InformerProps => ({
        color: props.color,
    }),
);
