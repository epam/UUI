import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DatasourceTableViewer, datasourceTextColumns } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Link to datasource overview 1' },
    { id: '2', name: 'Link to datasource overview 2' },
    { id: '3', name: 'Link to datasource overview 3' },
];

export default function RowOptionsLinkExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const datasource1 = useArrayDataSource({
        items,
        rowOptions: {
            link: {
                pathname: '/documents',
                query: {
                    id: 'datasources-overview',
                    mode: 'doc',
                    skin: 'UUI4_promo',
                    category: 'datasources-details',
                },
            },
        },
    }, []);

    return (
        <DatasourceTableViewer
            exampleTitle="Rows as links"
            value={ value1 }
            onValueChange={ onValueChange1 }
            datasource={ datasource1 }
            columns={ datasourceTextColumns }
        />
    );
}
