import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

const items = [{
    id: 0,
    status: 'OK',
    statusCode: 200,
},
{
    id: 1,
    status: 'Created',
    statusCode: 201,
},
{
    id: 2,
    status: 'Bad request',
    statusCode: 400,
},
{
    id: 3,
    status: 'Internal Server Error',
    statusCode: 500,
}];

export default function ArrayDataSourceSortingExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        sorting: [{ field: 'status', direction: 'desc' }],
    });

    const [value2, onValueChange2] = useState<DataSourceState>({
        sorting: [{ field: 'status', direction: 'desc' }],
    });

    const dataSource1 = useArrayDataSource({
        items,
    }, []);

    const dataSource2 = useArrayDataSource({
        items,
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'status':
                    return item.statusCode;
                default:
                    return item[sorting.field as keyof typeof item];
            }
        },
    }, []);

    return (
        <>
            <DataSourceViewer
                exampleTitle="Sorting by status name desc"
                value={ value1 }
                onValueChange={ onValueChange1 }
                dataSource={ dataSource1 }
                getName={ ({ status }) => status }
            />
            <DataSourceViewer
                exampleTitle="Sorting by status code desc, overridden by sortBy"
                value={ value2 }
                onValueChange={ onValueChange2 }
                dataSource={ dataSource2 }
                getName={ ({ status }) => status }
            />
        </>
    );
}
