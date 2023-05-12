import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

interface Item {
    id: string;
    name: string;
    parentId?: string;
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

export default function DatasourceStateSortingExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        sorting: [{ field: 'name', direction: 'desc' }],
    });

    const datasource1 = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle="Predefined sorting"
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
