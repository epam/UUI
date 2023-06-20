import React, { useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
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

export default function DataSourcePropsSelectAllExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: true } },
        isFoldedByDefault: () => false,

        selectAll: true,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: true } },
        isFoldedByDefault: () => false,

        cascadeSelection: 'implicit',
        selectAll: true,
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="Select all in 'explicit' mode"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                selectAll={ true }
            />
            <DataSourceViewer
                exampleTitle="Select all in 'implicit' mode"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                selectAll={ true }
            />
        </>
    );
}
