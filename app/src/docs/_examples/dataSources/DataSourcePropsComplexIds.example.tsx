import React, { useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

const items = [
    { id: ['project', { complexId: 1 }], name: 'Record 1' },
    { id: ['story', { complexId: 2 }], name: 'Record 2' },
    { id: ['task', { complexId: 3 }], name: 'Record 3' },
];

export default function DataSourcePropsComplexIdsExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items: items,
        complexIds: true,
        rowOptions: {
            checkbox: { isVisible: true },
        },
    }, []);

    return (
        <DataSourceViewer
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource1 }
        />
    );
}
