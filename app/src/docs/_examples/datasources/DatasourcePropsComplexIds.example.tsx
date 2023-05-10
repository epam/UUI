import React, { useState } from 'react';
import { DatasourceViewer } from './DatasourceViewer';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

const items = [
    { id: ['project', { complexId: 1 }], name: 'Record 1' },
    { id: ['story', { complexId: 2 }], name: 'Record 2' },
    { id: ['task', { complexId: 3 }], name: 'Record 3' },
];

export default function DatasourcePropsComplexIdsExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items: items,
        complexIds: true,
        rowOptions: {
            checkbox: { isVisible: true },
        },
    }, []);

    return (
        <DatasourceViewer
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource1 }
        />
    );
}
