import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource, useForm } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceColumns } from '@epam/uui-docs';

interface Item {
    id: string;
    name: string;
    parentId?: string;
}

interface FormState {
    items: Record<string, Item>;
}

const items: Record<string, Item> = {
    1: { id: '1', name: 'Parent 1' },
    1.1: { id: '1.1', name: 'Child 1.1', parentId: '1' },
    1.2: { id: '1.2', name: 'Child 1.2', parentId: '1' },
    
    2: { id: '2', name: 'Parent 2' },
    2.1: { id: '2.1', name: 'Child 2.1', parentId: '2' },
    2.2: { id: '2.2', name: 'Child 2.2', parentId: '2' },
    
    3: { id: '3', name: 'Parent 3' },
    3.2: { id: '3.2', name: 'Child 3.2', parentId: '3' },
    3.1: { id: '3.1', name: 'Child 3.1', parentId: '3' },
};

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
        items: Object.values(formValue1.items),
        getRowOptions: (item) => ({
            ...lens1.prop('items').prop(item.id).toProps(),
        }),
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items: Object.values(formValue2.items),
        getRowOptions: (item) => ({
            ...lens2.prop('items').prop(item.id).toProps(),
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
