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
];

export default function RowOptionsValueExample() {
    // under the hood
    const [item, onItemChange] = useState(items[0]);
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items: items,
        getRowOptions: () => ({
            value: item,
            onValueChange: onItemChange,
        }),
    }, []);

    // usual usage
    const { lens: lens2, value: formValue2 } = useForm<FormState>({
        value: { items },
        onSave: () => Promise.resolve(),
    });
    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items: formValue2.items,
        getRowOptions: (_, index) => ({
            ...lens2.prop('items').index(index).toProps(),
        }),
    }, []);

    return (
        <>
            <DataSourceTableViewer
                exampleTitle="Under the hood"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                columns={ dataSourceColumns }
            />
            <DataSourceTableViewer
                exampleTitle="How it is usually used"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                columns={ dataSourceColumns }
            />
        </>
    );
}
