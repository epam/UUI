import React, { useMemo, useState } from 'react';
import { DataColumnProps, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/uui';
import { Product } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function ProductTable() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState({});

    const dataSource = useAsyncDataSource<Product, number, unknown>(
        {
            // Provide api which returns Promise with items for table. If you want to pass just array of items, look to the ArrayDataSource
            api: (options) => svc.api.demo.products(options).then((r: any) => r.items),
            getId: (p) => p.ProductID, // Default: p => p.id
        },
        [],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({
            checkbox: { isVisible: true },
            isSelectable: true,
        }), // Provide metadata options about row. Go to the "DataRowOptions" interface, to see the full list of possible options.
        getFilter: () => (item) => !!item.Color, // Provide filter callback, if your need to apply filtering for rows.
        // By default sorting will be applied by column 'key' field. If you need another behavior, pass sortBy callback, which will return item field for sorting;
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'id':
                    return item.ProductID;
                case 'name':
                    return item.Name;
            }
        },
        // Also you can provide more options if you need:
        // getSearchFields(item: Product): string[] { return [item.Name, item.Color] }, Function that return array of item fields by which search will applies;
        // isFoldedByDefault(item: Product): boolean { return true }, Defined if row is folded by default for first render or not;
        // cascadeSelection: true, Default: false; If you have tree structure, you can define: cascade selections from parent to each child or only select parent;
    });

    const productColumns: DataColumnProps<Product>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'Id',
                render: (product) => <Text color="secondary">{product.ProductID}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 120,
            }, {
                key: 'name',
                caption: 'Name',
                render: (product) => (
                    <Text color="secondary" fontWeight="600">
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
        ],
        [],
    );

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
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
