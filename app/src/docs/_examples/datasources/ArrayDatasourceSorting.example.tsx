import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

const items = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${index}`,
}));

export default function ArrayDatasourceSortingExample() {
    const [value, onValueChange] = useState<DataSourceState>({
        sorting: [{ field: 'name', direction: 'desc' }],
    });

    const datasource = useArrayDataSource({
        items,
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle="Sorting by name desc"
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource }
        />
    );
}
