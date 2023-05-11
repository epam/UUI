import React, { useState } from 'react';
import { DataSourceState, Metadata, useArrayDataSource, useForm } from '@epam/uui-core';
import DatasourceTableViewer from './DatasourceTableViewer';
import { columns } from './columns';

interface Item {
    id: string;
    name: string;
    parentId?: string;
}

interface FormState {
    items: Item[];
}

const items: Item[] = [
    { id: '1', name: 'x' },
    { id: '1.1', name: 'Child 1.1', parentId: '1' },
    { id: '1.2', name: 'Child 1.2', parentId: '1' },
    
    { id: '2', name: 'Parent 2' },
    { id: '2.1', name: 'Child 2.1', parentId: '2' },
    { id: '2.2', name: 'Child 2.2', parentId: '2' },
    
    { id: '3', name: 'Parent 3' },
    { id: '3.2', name: 'Child 3.2', parentId: '3' },
    { id: '3.1', name: 'Child 3.1', parentId: '3' },
];

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true },
                },
            },
        },
    },
};

export default function RowOptionsIsRequiredExample() {
    const { lens: lens1, value: formValue1 } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
        validationOn: 'change',
    });

    const { lens: lens2, value: formValue2 } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
        validationOn: 'change',
        getMetadata: () => metadata,
    });

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items: formValue1.items,
        getRowOptions: (item, index) => ({
            ...lens1.prop('items').index(index).toProps(),
        }),
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const datasource2 = useArrayDataSource({
        items: formValue2.items,
        getRowOptions: (item, index) => ({
            ...lens2.prop('items').index(index).toProps(),
        }),
    }, []);

    return (
        <>
            <DatasourceTableViewer
                exampleTitle="Not required name"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
                columns={ columns }
            />
            <DatasourceTableViewer
                exampleTitle="Required name"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
                columns={ columns }
            />
        </>
    );
}
