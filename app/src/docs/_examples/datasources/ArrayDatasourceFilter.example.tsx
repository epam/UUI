import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceViewer } from '@epam/uui-docs';

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

export default function ArrayDataSourceSearchExample() {
    const [value, onValueChange] = useState<DataSourceState<Filter>>({
        filter: {
            gt: { id: 50 },
        },
    });
    const dataSource = useArrayDataSource<Item, number, Filter>({
        items,
        getFilter: (filter) => ({ id }) => id > filter?.gt?.id,
    }, []);
    
    return (
        <DataSourceViewer
            exampleTitle={ `Filter: ${JSON.stringify(value.filter ?? {}, null, 4)}` }
            value={ value }
            onValueChange={ onValueChange }
            dataSource={ dataSource }
        />
    );
}
