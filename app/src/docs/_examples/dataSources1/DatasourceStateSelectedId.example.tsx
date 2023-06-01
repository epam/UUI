import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function DataSourceStateSelectedIdExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        selectedId: '2',
    });
    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: {
            isSelectable: true,
        },
    }, []);

    return (
        <DataSourceViewer
            exampleTitle="Without search"
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
        />
    );
}
