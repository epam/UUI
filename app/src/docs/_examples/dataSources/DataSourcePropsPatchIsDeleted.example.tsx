import React, { useMemo, useState } from 'react';
import { DataSourceViewer } from '@epam/uui-docs';
import { DataSourceState, ItemsMap, ItemsMapParams, useArrayDataSource } from '@epam/uui-core';

interface Item {
    id: string;
    name: string;
    parentId?: string;
    isDeleted?: boolean;
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
 
export default function DataSourcePropsPatchIsDeletedExample() {
    const patch = useMemo(() => ItemsMap.fromObject<string, Item>(
        { 1: { id: '1', name: 'Parent 1', isDeleted: true } },
        params,
    ), []);

    const [value, onValueChange] = useState<DataSourceState>({});
    const dataSource = useArrayDataSource({
        items,
        patch,
        isDeleted: (item) => item.isDeleted ?? false,
    }, []);

    return (
        <DataSourceViewer
            exampleTitle="Delete item from the list"
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
