import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

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

export default function DatasourceStateFoldedExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        folded: { 2: false },
    });
    const datasource1 = useArrayDataSource({
        items,
        rowOptions: {
            checkbox: { isVisible: true },
        },
        // isFoldedByDefault: ({ id }) => id !== '2',
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle="Predefined folding"
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
        />
    );
}
