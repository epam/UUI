import * as React from 'react';
import { IEditable } from '@epam/uui';
import { IDemoApi } from './demoApi';

export interface DemoComponentProps<TProps = any> {
    DemoComponent: React.ComponentType<TProps>;
    props: any;
}

export interface IComponentDocs<TProps> {
    name: string;
    component?: React.ComponentType<TProps>;
    props?: PropDoc<TProps, keyof TProps>[];
    contexts?: DemoContext[];
}

export interface DemoContext {
    context: React.ComponentClass<DemoComponentProps>;
    name: string;
}

export interface PropSamplesCreationContext<TProps = {}> {
    getCallback(name: string): () => void;
    getChangeHandler(name: string): (newValue: any) => void;
    getSelectedProps(): TProps;
    apollo: any;
    demoApi: IDemoApi;
    forceUpdate: () => void;
}

export type PropExample<TProp> = {
    id?: string;
    name?: string;
    value: TProp;
    isDefault?: boolean;
} | TProp;

export interface PropDoc<TProps, TProp extends keyof TProps> {
    name: Extract<keyof TProps, string>;
    description?: string;
    isRequired: boolean;
    defaultValue?: TProps[TProp];
    examples?: PropExample<TProps[TProp]>[] | ((ctx: PropSamplesCreationContext<TProps>) => PropExample<TProps[TProp]>[]);
    type?: 'string' | 'number';
    renderEditor?: (editable: IEditable<TProp>, examples?: TProps[TProp][], componentProps?: TProps) => React.ReactNode;
}