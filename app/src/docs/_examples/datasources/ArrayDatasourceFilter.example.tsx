import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from '@epam/uui-docs';

interface Item {
    id: number;
    name: string;
}

interface Filter {
    gt?: {
        id?: number,
    };
}

const items = Array(100).fill(0).map((_, index) => ({
    id: index,
    name: `Record ${index}`,
}));

export default function ArrayDatasourceSearchExample() {
    const [value, onValueChange] = useState<DataSourceState<Filter>>({
        filter: {
            gt: { id: 50 },
        },
    });
    const datasource = useArrayDataSource<Item, number, Filter>({
        items,
        getFilter: (filter) => ({ id }) => id > filter?.gt?.id,
    }, []);
    
    return (
        <DatasourceViewer
            exampleTitle={ `Filter: ${JSON.stringify(value.filter ?? {}, null, 4)}` }
            value={ value }
            onValueChange={ onValueChange }
            datasource={ datasource }
        />
    );
}
