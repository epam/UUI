import React, { useState } from 'react';
import { DataSourceState, useArrayDataSource } from '@epam/uui-core';
import { DataSourceTableViewer, dataSourceTextColumns } from '@epam/uui-docs';

const items = [
    { id: '1', name: 'Link to dataSource overview 1' },
    { id: '2', name: 'Link to dataSource overview 2' },
    { id: '3', name: 'Link to dataSource overview 3' },
];

export default function RowOptionsLinkExample() {
    const [value1, onValueChange1] = useState<DataSourceState>({});
    const dataSource1 = useArrayDataSource({
        items,
        rowOptions: {
            link: {
                pathname: '/documents',
                query: {
                    id: 'dataSources-overview',
                    mode: 'doc',
                    skin: 'UUI4_promo',
                    category: 'dataSources-details',
                },
            },
        },
    }, []);

    return (
        <DataSourceTableViewer
            exampleTitle="Rows as links"
            value={ value1 }
            onValueChange={ onValueChange1 }
            dataSource={ dataSource1 }
            columns={ dataSourceTextColumns }
        />
    );
}
