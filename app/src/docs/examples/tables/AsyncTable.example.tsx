import React, { useState } from 'react';
import { DataTable, Panel, Text } from "@epam/promo";
import { DataColumnProps, useAsyncDataSource } from '@epam/uui';
import { Product } from '@epam/uui-docs';
import { svc } from "../../../services";
import * as css from './TablesExamples.scss';

export function ProductTable() {
    const [value, onValueChange] = useState({});

    const dataSource = useAsyncDataSource<Product, number, any>({
        // Provide api which returns Promise with items for table. If you want to pass just array of items, look to the ArrayDataSource
        api: () => svc.api.demo.products({}).then(r => r.items),
        getId: p => p.ProductID, // Default: p => p.id
    });

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: (item: Product) => ({
            checkbox: { isVisible: true },
            isSelectable: true,
        }), // Provide metadata options about row. Go to the "DataRowOptions" interface, to see the full list of possible options.
        getFilter: (filter => (item) => !!item.Color), // Provide filter callback, if your need to apply filtering for rows.

        // By default sorting will be applied by column 'key' field. If you need another behavior, pass sortBy callback, which will return item field for sorting;
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'id': return item.ProductID;
                case 'name': return item.Name;
            }
        },

        // Also you can provide more options if you need:
        // getSearchFields(item: Product): string[] { return [item.Name, item.Color] }, Function that return array of item fields by which search will applies;
        // isFoldedByDefault(item: Product): boolean { return true }, Defined if row is folded by default for first render or not;
        // cascadeSelection: true, Default: false; If you have tree structure, you can define: cascade selections from parent to each child or only select parent;
    });

    const productColumns: DataColumnProps<Product>[] = [
        {
            key: 'id',
            caption: 'ID',
            render: product => <Text color='gray60'>{ product.ProductID }</Text>,
            isSortable: true,
            isAlwaysVisible: true,
            grow: 0, shrink: 0, width: 96,
        }, {
            key: 'name',
            caption: 'NAME',
            render: product => <Text color='gray80' font='sans-semibold'>{ product.Name }</Text>,
            isSortable: true,
            grow: 1, minWidth: 224,
        }, {
            key: 'productNumber',
            caption: 'PRODUCT NUMBER',
            render: product => <Text>{ product.ProductNumber }</Text>,
            grow: 0, shrink: 0, width: 144,
        },
        {
            key: 'color',
            caption: 'COLOR',
            render: product => <Text>{ product.Color }</Text>,
            grow: 0, shrink: 0, width: 156,
        },
    ];

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                headerTextCase='upper'
            />
        </Panel>

    );
}
