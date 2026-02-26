import React from 'react';
import * as uui from '@epam/uui';
import { Text } from '@epam/uui';
import { demoData, FeatureClass } from '@epam/uui-docs';
import { ArrayDataSource, DataColumnGroupProps } from '@epam/uui-core';

import { rowsExample } from './tableOverviewData';

export const tableOverviewColumnsExample = [
    {
        name: 'columns',
        value: [
            {
                key: 'id',
                caption: 'Id',
                render: (item: FeatureClass) => <Text color="primary">{item.id}</Text>,
                isSortable: true,
                isAlwaysVisible: true,
                width: 100,
            }, {
                key: 'name',
                caption: 'Name',
                render: (item: FeatureClass) => <Text color="primary">{item.name}</Text>,
                isSortable: true,
                width: 300,
                group: 'details',
            }, {
                key: 'description',
                caption: 'Description',
                render: (item: FeatureClass) => <Text color="primary">{item.description}</Text>,
                grow: 1,
                width: 300,
                group: 'details',
            },
        ],
    },
];

export const tableOverviewRowsExample = () => {
    return [
        {
            name: 'rows without checkbox',
            value: rowsExample.slice(0, 5),
        },
        {
            name: 'rows with checkbox',
            value: rowsExample.slice(0, 5).map((item) => ({ ...item, checkbox: { isVisible: true } })),
        },
    ];
};

export const tableOverviewGetRowsExample = () => {
    return [
        {
            name: 'rows without checkbox',
            value: () => rowsExample.slice(5, 10),
            isDefault: true,
        },
        {
            name: 'rows with checkbox',
            value: () => rowsExample.slice(5, 10).map((item) => ({ ...item, checkbox: { isVisible: true } })),
        },
    ];
};

export const tableOverviewColumnsGroupsExample = () => {
    return [
        {
            name: 'Example columns groups',
            value: [
                {
                    key: 'details',
                    caption: 'Details',
                    textAlign: 'center',
                },
            ] as DataColumnGroupProps[],
        },
    ];
};

export const tableOverviewSelectAllExample = [
    { name: 'do nothing', value: { onValueChange: () => {}, value: false } },
];

export const tableOverviewFiltersExample = [
    {
        name: 'Ids filter',
        value: [
            {
                field: 'id',
                columnKey: 'id',
                title: 'Id',
                type: 'singlePicker' as const,
                dataSource: new ArrayDataSource({ items: demoData.featureClasses.map((item) => ({ id: item.id, name: item.id })) }),
                predicates: uui.defaultPredicates.multiPicker,
            },
        ],
    },
];

export const tableOverviewValueExample = [
    { name: 'with columns config', value: { columnsConfig: { name: { isVisible: false, width: 100 } } } },
];

export const tableOverviewDataTableFocusManagerExample = [
    { name: 'empty', value: null as null },
];
