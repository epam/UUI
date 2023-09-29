import React, { useState } from 'react';
import { DataColumnProps, useAsyncDataSource } from '@epam/uui-core';
import { svc } from '../../services';
import { DataTable, Panel, Text } from '@epam/promo';
import { Product } from '@epam/uui-docs';
import css from './DisabledCheckboxesTable.module.scss';

const productColumns: DataColumnProps<Product>[] = [
    {
        key: 'id',
        caption: 'Id',
        render: (product) => <Text color="gray60">{product.ProductID}</Text>,
        isSortable: true,
        isAlwaysVisible: true,
        width: 120,
    }, {
        key: 'name',
        caption: 'Name',
        render: (product) => (
            <Text color="gray80" font="sans-semibold">
                {product.Name}
            </Text>
        ),
        isSortable: true,
        grow: 1,
        width: 224,
    }, {
        key: 'productNumber',
        caption: 'Product number',
        render: (product) => <Text>{product.ProductNumber}</Text>,
        width: 144,
    }, {
        key: 'color',
        caption: 'Color',
        render: (product) => <Text>{product.Color}</Text>,
        width: 156,
    },
];

export function DisabledCheckboxesTable() {
    const [value, onValueChange] = useState({});

    const dataSource = useAsyncDataSource<Product, number, unknown>(
        {
            // Provide api which returns Promise with items for table. If you want to pass just array of items, look to the ArrayDataSource
            api: () => svc.api.demo.products({}).then((r: any) => r.items),
            getId: (p) => p.ProductID, // Default: p => p.id
        },
        [],
    );
  
    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({
            checkbox: {
                isVisible: true,
                isDisabled: true,
            },
            isSelectable: true,
        }), // Provide metadata options about row. Go to the "DataRowOptions" interface, to see the full list of possible options.
    });

    return (
        <Panel cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                headerTextCase="upper"
            />
        </Panel>
    );
}
