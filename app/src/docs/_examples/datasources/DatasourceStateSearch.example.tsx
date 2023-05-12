import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceViewer } from './DatasourceViewer';

const items = [
    { id: '1', name: 'Parent 1' },
    { id: '2', name: 'Parent 2' },
    { id: '3', name: 'Parent 3' },
];

export default function DatsourceStateSearchExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items,
        getSearchFields: ({ name }) => [name],
    }, []);

    const [value2, onValueChange2] = useState<DataSourceState>({
        search: 'Parent 1',
    });
    const datasource2 = useArrayDataSource({
        items,
        getSearchFields: ({ name }) => [name],
    }, []);

    return (
        <>
            <DatasourceViewer
                exampleTitle="Without search"
                value={ value1 }
                onValueChange={ onValueChange1 }
                datasource={ datasource1 }
            />
            <DatasourceViewer
                exampleTitle="search = 'Parent 1'"
                value={ value2 }
                onValueChange={ onValueChange2 }
                datasource={ datasource2 }
            />
        </>
    );
}
