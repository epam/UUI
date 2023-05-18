import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

const items1 = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${index}`,
}));

const items2 = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${100 - index}`,
}));

export default function ArrayDatasourceSortingExample() {
    const [value, onValueChange] = useState<DataSourceState>({
        sorting: [{ field: 'name', direction: 'desc' }],
    });

    const datasource1 = useArrayDataSource({
        items: items1,
    }, []);

    const datasource2 = useArrayDataSource({
        items: items2,
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'name':
                    return item.id;
                default:
                    return item[sorting.field as keyof typeof item];
            }
        },
    }, []);

    return (
        <>
            <DatasourceViewer
                exampleTitle="Sorting by name desc"
                value={ value }
                onValueChange={ onValueChange }
                datasource={ datasource1 }
            />
            <DatasourceViewer
                exampleTitle="Sorting by id desc, overridden by sortBy"
                value={ value }
                onValueChange={ onValueChange }
                datasource={ datasource2 }
            />
        </>
    );
}
