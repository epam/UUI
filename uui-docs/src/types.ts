import * as React from 'react';
import { IEditable } from '@epam/uui-core';
import { IDemoApi } from './demoApi';

export interface DemoComponentProps<TProps = any> {
    DemoComponent: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>;
    props: TProps;
}

export interface IComponentDocs<TProps> {
    name: string;
    component?: React.ComponentType<TProps> | React.NamedExoticComponent<TProps>;
    props?: PropDoc<TProps, keyof TProps>[];
    contexts?: DemoContext[];
}

export interface DemoContext {
    context: React.ComponentType<DemoComponentProps>;
    name: string;
}

export interface IPropSamplesCreationContext<TProps = {}> {
    getCallback(name: string): () => void;
    getChangeHandler(name: string): (newValue: any) => void;
    getSelectedProps(): TProps;
    demoApi: IDemoApi;
    forceUpdate: () => void;
}

export type PropExampleObject<TProp> = {
    id?: string;
    name?: string;
    value: TProp;
    isDefault?: boolean;
    color?: string;
};

export type PropExample<TProp> = PropExampleObject<TProp> | TProp;

export interface ISharedPropEditor<TProp = any> {
    name: string;
    value: TProp;
    exampleId: string;
    examples: PropExampleObject<TProp>[];
    onValueChange(newValue: TProp): void;
    onExampleIdChange(newExampleId: string): void;
}
export type TSharedPropEditorType =
    'CssClassEditor' |
    'JsonEditor' |
    'JsonView' |
    'LinkEditor' |
    'NumEditor' |
    'StringEditor' |
    'StringWithExamplesEditor' |
    'MultiUnknownEditor' |
    'SingleUnknownEditor' |
    'CantResolve'
    ;

export type TRenderEditorFn<TProps, TProp extends keyof TProps> =
    (editable: IEditable<TProps[TProp]>, examples?: TProps[TProp][]) => React.ReactNode;

export type TRenderEditor<TProps, TProp extends keyof TProps> = TRenderEditorFn<TProps, TProp> | TSharedPropEditorType;

export interface PropDoc<TProps, TProp extends keyof TProps> {
    name: Extract<keyof TProps, string>;
    description?: string;
    isRequired: boolean;
    defaultValue?: TProps[TProp];
    examples?: PropExample<TProps[TProp]>[] | ((ctx: IPropSamplesCreationContext<TProps>) => PropExample<TProps[TProp]>[]);
    type?: 'string' | 'number';
    renderEditor?: TRenderEditor<TProps, TProp>;
    color?: string;
    remountOnChange?: boolean;
}
