import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function DataSourceStateSearchExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        getSearchFields: ({ name }) => [name],
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({
        search: 'Parent 1',
    });
    const dataSource2 = useArrayDataSource({
        items,
        getSearchFields: ({ name }) => [name],
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="Without search"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
            />
            <DataSourceViewer
                exampleTitle="search = 'Parent 1'"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
            />
        </>
    );
}
