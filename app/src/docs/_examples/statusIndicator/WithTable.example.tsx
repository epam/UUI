import React from 'react';
import { DataTable, Panel, FlexRow, Text, StatusIndicator, StatusIndicatorColors } from '@epam/uui';
import { DataColumnProps, getSeparatedValue, useLazyDataSource, useTableState, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 180,
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'profileStatus',
        caption: 'Profile status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow columnGap="6">
                    <StatusIndicator size="18" fill="outline" color={ p.profileStatus.toLowerCase() as StatusIndicatorColors } />
                    <Text>{ p.profileStatus }</Text>
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
    },
    {
        key: 'salary',
        caption: 'Salary',
        render: (p) => (
            <Text>
                {getSeparatedValue(+p.salary, {
                    style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2,
                }, 'en-US')}
            </Text>
        ),
        width: 150,
        textAlign: 'right',
        isSortable: true,
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 200,
    },
    {
        key: 'productionCategory',
        caption: 'Is Production',
        render: (r) => <Text>{r.productionCategory ? 'Yes' : 'No' }</Text>,
        width: 100,
    },
];

export default function WithTableExample() {
    const { api } = useUuiContext();

    const { tableState, setTableState } = useTableState({
        columns: personColumns,
    });

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(tableState, setTableState);

    return (
        <Panel background="surface" style={ { height: '400px' } }>
            <DataTable getRows={ view.getVisibleRows } columns={ personColumns } value={ tableState } onValueChange={ setTableState } { ...view.getListProps() } />
        </Panel>
    );
}
