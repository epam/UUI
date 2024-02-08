import * as React from 'react';
import {
    IPropSamplesCreationContext,
    PropDoc, TDocsGenExportedType,
} from '@epam/uui-docs';

export interface IPeTableProps<TProps> {
    inputData: {
        [name in keyof TProps]: {
            value?: TProps[keyof TProps] | undefined;
            exampleId?: string | undefined;
        }
    };
    children: React.ReactNode;
    onExampleIdChange: (params: { prop: PropDoc<TProps, keyof TProps>, newExampleId: string | undefined }) => void;
    onResetAllProps: () => void;
    onClearProp: (name: keyof TProps) => void;
    onValueChange: (params: { prop: PropDoc<TProps, keyof TProps>, newValue: TProps[keyof TProps] }) => void;
    propContext: IPropSamplesCreationContext<TProps>,
    propDoc: PropDoc<TProps, keyof TProps>[]
    title: string;
    typeRef: TDocsGenExportedType;
}

export interface IPeTableRowProps<TProps> {
    onClearProp: IPeTableProps<TProps>['onClearProp']
    propContext: IPeTableProps<TProps>['propContext']
    onValueChange: IPeTableProps<TProps>['onValueChange']
    onExampleIdChange: IPeTableProps<TProps>['onExampleIdChange']
    prop: PropDoc<TProps, keyof TProps>;
    value: TProps[keyof TProps];
    exampleId: string | undefined;
}
