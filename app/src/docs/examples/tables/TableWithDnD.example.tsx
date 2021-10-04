import React, { useMemo, useState } from 'react';
import { DataTable, Panel, Text } from "@epam/promo";
import { DataColumnProps, DataTableState, getOrderBetween, useArrayDataSource } from '@epam/uui';
import { demoData, FeatureClass} from '@epam/uui-docs';
import * as css from './TablesExamples.scss';
import sortBy from 'lodash.sortby';

export default function TableWithDnDExample() {
    const [value, onValueChange] = useState<DataTableState>({});
    const [items, setItems] = useState(demoData.featureClasses);

    const dataSource = useArrayDataSource<FeatureClass, number, unknown>({
        items: items,
    }, []);

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: (i, index) => ({
            dnd: {
                srcData: i,
                dstData: i,
                onDrop: data => {
                    const arrIndex = index - 1;

                    let newOrder = data.position === 'top'
                        ? getOrderBetween(items[arrIndex - 1]?.order, data.dstData.order)
                        : getOrderBetween(data.dstData.order, items[arrIndex + 1]?.order);

                    const result = items.map(i => i === data.srcData ? { ...data.srcData, order: newOrder} : i);
                    const sortedResult = sortBy(result, i => i.order);

                    setItems(sortedResult);
                },
                canAcceptDrop: i => ({
                    top: true,
                    bottom: true,
                }),
            },
        }),
    });

    const productColumns: DataColumnProps<FeatureClass>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'Id',
            render: item => <Text color='gray80'>{ item.id }</Text>,
            isSortable: true,
            isAlwaysVisible: true,
            grow: 0, shrink: 0, width: 100,
        }, {
            key: 'name',
            caption: 'Name',
            render: item => <Text color='gray80'>{ item.name }</Text>,
            isSortable: true,
            grow: 0, minWidth: 300,
        }, {
            key: 'description',
            caption: 'Description',
            render: item => <Text color='gray80'>{ item.description }</Text>,
            grow: 1, shrink: 0, width: 300,
        },
    ], []);

    return (
        <Panel shadow cx={ css.container } rawProps={{
            role: 'table',
            'aria-rowcount': view.getListProps().rowsCount,
            'aria-colcount': productColumns.length
        }}>
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
