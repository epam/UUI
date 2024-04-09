import React, { useMemo, useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
import { DataSourceState, ItemsMap, ItemsMapParams, useArrayDataSource } from '@epam/uui-core';

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

const params: ItemsMapParams<Item, string> = { getId: (item) => item.id };
 
export default function DataSourcePropsPatchExample() {
    const patch1 = useMemo(() => ItemsMap.fromObject<string, Item>(
        { 4: { id: '4', name: 'Parent 4' } },
        params,
    ), []);

    const patch2 = useMemo(() => ItemsMap.fromObject<string, Item>(
        { 1: { id: '1', name: 'Parent 1 with new name' } },
        params,
    ), []);

    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        patch: patch1,
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({});
    const dataSource2 = useArrayDataSource({
        items,
        patch: patch2,
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="Add new element to the list"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="Update existing element"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
        </>
    );
}
