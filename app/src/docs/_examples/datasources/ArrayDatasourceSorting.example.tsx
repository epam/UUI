import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

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

export default function ArrayDatasourceSortingExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({
        sorting: [{ field: 'status', direction: 'desc' }],
    });

    const [value2, onValueChange2] = useState<DataSourceState>({
        sorting: [{ field: 'status', direction: 'desc' }],
    });

    const datasource1 = useArrayDataSource({
        items,
    }, []);

    const datasource2 = useArrayDataSource({
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
            <DatasourceViewer
                exampleTitle="Sorting by status name desc"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
                getName={ ({ status }) => status }
            />
            <DatasourceViewer
                exampleTitle="Sorting by status code desc, overridden by sortBy"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
                getName={ ({ status }) => status }
            />
        </>
    );
}
