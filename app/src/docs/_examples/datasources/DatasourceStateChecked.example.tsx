import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function DatasourceStateCheckedExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        checked: ['2'],
    });
    const datasource1 = useArrayDataSource({
        items,
        rowOptions: {
            checkbox: { isVisible: true },
        },
    }, []);

    return (
        <DatasourceViewer
            exampleTitle="Predefined checks"
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
