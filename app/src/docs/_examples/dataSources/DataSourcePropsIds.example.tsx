import React, { useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';

const items1 = [
    { customId: '1', name: 'Record 1' },
    { customId: '2', name: 'Record 2' },
    { customId: '3', name: 'Record 3' },
];

const items2 = [
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

const items3 = [
    { id: '1', name: 'Parent 1' },
    { id: '1.1', name: 'Child 1.1', customParentId: '1' },
    { id: '1.2', name: 'Child 1.2', customParentId: '1' },
    
    { id: '2', name: 'Parent 2' },
    { id: '2.1', name: 'Child 2.1', customParentId: '2' },
    { id: '2.2', name: 'Child 2.2', customParentId: '2' },
    
    { id: '3', name: 'Parent 3' },
    { id: '3.1', name: 'Child 3.1', customParentId: '3' },
    { id: '3.2', name: 'Child 3.2', customParentId: '3' },
];

const items4 = [
    { id: '1', name: 'Parent 1' },
    { id: '1.1', name: 'Child 1.1', customParentId: '1' },
    { id: '1.2', name: 'Child 1.2', customParentId: '1' },
    
    { id: '2', name: 'Parent 2' },
    { id: '2.1', name: 'Child 2.1', customParentId: '2' },
    { id: '2.2', name: 'Child 2.2', customParentId: '2' },
    
    { id: '3', name: 'Parent 3' },
    { id: '3.1', name: 'Child 3.1', customParentId: '3' },
    { id: '3.2', name: 'Child 3.2', customParentId: '3' },
];

export default function DataSourcePropsIdsExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items: items1,
        getId: ({ customId }) => customId,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items: items2,
    }, []);

    const [value3, onValueChange3] = useState<DataSourceState>({});
    const dataSource3 = useArrayDataSource({
        items: items3,
    }, []);

    const [value4, onValueChange4] = useState<DataSourceState>({});
    const dataSource4 = useArrayDataSource({
        items: items4,
        getParentId: (item) => item.customParentId,
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="When id field is custom"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="When parent id field is parentId"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
            <DataSourceViewer
                exampleTitle="When parentId is undefined"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
            />
            <DataSourceViewer
                exampleTitle="When custom getParentId is specified"
                value={ value4 }
                onValueChange={ onValueChange4 }
                dataSource={ dataSource4 }
            />
        </>
    );
}
