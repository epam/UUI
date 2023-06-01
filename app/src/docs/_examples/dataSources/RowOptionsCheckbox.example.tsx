import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceTextColumns } from '@epam/uui-docs';

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

export default function RowOptionsCheckboxExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: false } },
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: true } },
    }, []);

    const [value3, onValueChange3] = useState<DataSourceState>({});
    const dataSource3 = useArrayDataSource({
        items,
        rowOptions: { checkbox: { isVisible: true, isDisabled: true } },
    }, []);

    return (
        <>
            <DataSourceTableViewer
                exampleTitle="Without checkboxes"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                columns={ dataSourceTextColumns }
            />
            <DataSourceTableViewer
                exampleTitle="With visible checkboxes"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                columns={ dataSourceTextColumns }
            />
            <DataSourceTableViewer
                exampleTitle="With visible disabled checkboxes"
                value={ value3 }
                onValueChange={ onValueChange3 }
                dataSource={ dataSource3 }
                columns={ dataSourceTextColumns }
            />
        </>
    );
}
