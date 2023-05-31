import React, { useState } from 'react';
import { DatasourceViewer } from '@epam/uui-docs';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

const items = [
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

export default function DatasourcePropsIsFoldedByDefaultExample() {
    const [value, onValueChange] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items: items,
        isFoldedByDefault: ({ id }) => id !== '2',
    }, []);

    return (
        <DatasourceViewer
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource1 }
        />
    );
}
