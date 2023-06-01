import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource, useForm } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceColumns } from '@epam/uui-docs';

interface Item {
    id: string;
    name: string;
    parentId?: string;
}

interface FormState {
    items: Item[];
}

const items: Item[] = [
    { id: '1', name: 'Parent 1' },
    { id: '1.1', name: 'Child 1.1', parentId: '1' },
    { id: '1.2', name: 'Child 1.2', parentId: '1' },
    
    { id: '2', name: 'Parent 2' },
    { id: '2.1', name: 'Child 2.1', parentId: '2' },
    { id: '2.2', name: 'Child 2.2', parentId: '2' },
    
    { id: '3', name: 'Parent 3' },
    { id: '3.2', name: 'Child 3.2', parentId: '3' },
    { id: '3.1', name: 'Child 3.1', parentId: '3' },
];

export default function RowOptionsIsReadonlyExample() {
    const { lens: lens1, value: formValue1 } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
    });

    const { lens: lens2, value: formValue2 } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
    });

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items: formValue1.items,
        getRowOptions: (item, index) => ({
            ...lens1.prop('items').index(index).toProps(),
        }),
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items: formValue2.items,
        getRowOptions: (item, index) => ({
            ...lens2.prop('items').index(index).toProps(),
            isReadonly: true,
        }),
    }, []);

    return (
        <>
            <DataSourceTableViewer
                exampleTitle="Editable rows"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                columns={ dataSourceColumns }
            />
            <DataSourceTableViewer
                exampleTitle="Readonly rows"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                columns={ dataSourceColumns }
            />
        </>
    );
}
