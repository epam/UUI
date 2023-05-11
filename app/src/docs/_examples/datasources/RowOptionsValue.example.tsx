import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource, useForm } from '@epam/uui-core';
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
    { id: '1', name: 'Parent 1' },
];

export default function RowOptionsValueExample() {
    // under the hood
    const [item, onItemChange] = useState(items[0]);
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
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
    const datasource2 = useArrayDataSource({
        items: formValue2.items,
        getRowOptions: (_, index) => ({
            ...lens2.prop('items').index(index).toProps(),
        }),
    }, []);

    return (
        <>
            <DatasourceTableViewer
                exampleTitle="Under the hood"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
                columns={ columns }
            />
            <DatasourceTableViewer
                exampleTitle="How it is usually used"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
                columns={ columns }
            />
        </>
    );
}
