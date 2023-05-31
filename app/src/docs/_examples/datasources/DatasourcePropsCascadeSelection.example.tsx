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

export default function DataSourcePropsCascadeSelectionExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const [value2, onValueChange2] = useState<DataSourceState>({});
    const [value3, onValueChange3] = useState<DataSourceState>({});
    const [value4, onValueChange4] = useState<DataSourceState>({});

    const dataSource1 = useArrayDataSource({
        items: items,
        isFoldedByDefault: () => false,
        rowOptions: { checkbox: { isVisible: true } },
        cascadeSelection: false,
    }, []);

    const dataSource2 = useArrayDataSource({
        items: items,
        isFoldedByDefault: () => false,
        rowOptions: { checkbox: { isVisible: true } },
        cascadeSelection: true,
    }, []);

    const dataSource3 = useArrayDataSource({
        items: items,
        isFoldedByDefault: () => false,
        rowOptions: { checkbox: { isVisible: true } },
        cascadeSelection: 'explicit',
    }, []);

    const dataSource4 = useArrayDataSource({
        items: items,
        isFoldedByDefault: () => false,
        rowOptions: { checkbox: { isVisible: true } },
        cascadeSelection: 'implicit',
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="cascadeSelection: false"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="cascadeSelection: true"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            <DataSourceViewer
                exampleTitle="cascadeSelection: 'explicit'"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
            <DataSourceViewer
                exampleTitle="cascadeSelection: 'implicit'"
                value={ value4 }
                onValueChange={ onValueChange4 }
                dataSource={ dataSource4 }
            />
        </>
    );
}
