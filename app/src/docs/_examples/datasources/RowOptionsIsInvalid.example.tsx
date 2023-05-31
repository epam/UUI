import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceTextColumns } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function RowOptionsIsInvalidExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: { isInvalid: true },
    }, []);

    return (
        <DataSourceTableViewer
            exampleTitle="Rows are highlighted as invalid"
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
            columns={ dataSourceTextColumns }
        />
    );
}
