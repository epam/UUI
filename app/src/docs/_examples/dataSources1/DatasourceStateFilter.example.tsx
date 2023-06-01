import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

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

interface Filter {
    not?: {
        id?: string,
        parentId?: string,
    };
}

export default function DataSourceStateFoldedExample() {
    const [value1, onValueChange1] = useState<DataSourceState<Filter>>({
        filter: {
            not: {
                parentId: '1',
                id: '1',
            },
        },
    });
    const dataSource1 = useArrayDataSource<Item, string, Filter>({
        items,
        getFilter: (filter) => ({ id, parentId }) =>
            id !== filter.not.id && parentId !== filter.not.parentId,
    }, []);
    
    return (
        <DataSourceViewer
            exampleTitle="Predefined filter"
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
        />
    );
}
