import React, { useMemo, useState } from 'react';
import { DataColumnProps, DataTableState, getOrderBetween, useArrayDataSource, orderBy } from '@epam/uui-core';
import { DataTable, Panel, Text } from '@epam/uui';
import { demoData, FeatureClass } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function TableWithDnDExample() {
    const [value, onValueChange] = useState<DataTableState>({});
    const [items, setItems] = useState(demoData.featureClasses);

    const dataSource = useArrayDataSource<FeatureClass, number, unknown>(
        {
            items: items,
        },
        [items],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: (i, index) => ({
            dnd: {
                srcData: i,
                dstData: i,
                onDrop: (data) => {
                    const newOrder = data.position === 'top'
                        ? getOrderBetween(items[index - 1]?.order, data.dstData.order)
                        : getOrderBetween(data.dstData.order, items[index + 1]?.order);

                    const result = items.map((item) => (item === data.srcData ? { ...data.srcData, order: newOrder } : item));
                    const sortedResult = orderBy(result, (item) => item.order);

                    setItems(sortedResult);
                },
                canAcceptDrop: () => ({
                    top: true,
                    bottom: true,
                }),
            },
        }),
    });

    const productColumns: DataColumnProps<FeatureClass>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'Id',
                render: (item) => <Text color="primary">{item.id}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 100,
            }, {
                key: 'name',
                caption: 'Name',
                render: (item) => <Text color="primary">{item.name}</Text>,
                isSortable: true,
                width: 300,
            }, {
                key: 'description',
                caption: 'Description',
                render: (item) => <Text color="primary">{item.description}</Text>,
                grow: 1,
                width: 300,
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
