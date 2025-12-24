import React, { useMemo, useState } from 'react';
import { DataColumnProps, DataSourceState, useAsyncDataSource, useUuiContext } from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/uui';
import { Product } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function DisableVirtualizationExample() {
    const svc = useUuiContext();

    // In the case of disabling virtualization, we need to explicitly provide topIndex and visibleCount
    const [value, onValueChange] = useState<DataSourceState>({ topIndex: 0, visibleCount: 15 });

    const dataSource = useAsyncDataSource<Product, number, unknown>(
        {
            api: (options) => svc.api.demo.products({}, options).then((r: any) => r.items),
            getId: (p) => p.ProductID, // Default: p => p.id
        },
        [],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({
            checkbox: { isVisible: true },
        }),
    });

    const productColumns: DataColumnProps<Product>[] = useMemo(
        () => [
            {
                key: 'index',
                caption: 'Index',
                render: (product, rowProps) => <Text color="secondary">{ rowProps.index + 1 }</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 140,
            },
            {
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
            },
            {
                key: 'productNumber',
                caption: 'Product number',
                render: (product) => <Text>{product.ProductNumber}</Text>,
                width: 144,
            },
            {
                key: 'color',
                caption: 'Color',
                render: (product) => <Text>{product.Color}</Text>,
                width: 156,
            },
        ],
        [],
    );

    return (
        <Panel background="surface-main" shadow cx={ css.notLimitedHeightContainer }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                headerTextCase="upper"
                // Disable scroll virtualization
                disableVirtualization={ true }
            />
        </Panel>
    );
}
