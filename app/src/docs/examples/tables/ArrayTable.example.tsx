import React, { useState } from 'react';
import { DataTable, Panel, Text } from "@epam/promo";
import { DataColumnProps, useArrayDataSource } from '@epam/uui';
import { demoData, FeatureClass} from '@epam/uui-docs';
import * as css from './TablesExamples.scss';

export function ArrayDataTableExample() {
    const [value, onValueChange] = useState({});

    const dataSource = useArrayDataSource<FeatureClass, number, any>({
        items: demoData.featureClasses,
    });

    const view = dataSource.useView(value, onValueChange, {});

    const productColumns: DataColumnProps<FeatureClass>[] = [
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
