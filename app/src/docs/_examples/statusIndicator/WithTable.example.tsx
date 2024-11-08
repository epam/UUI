import React from 'react';
import { DataTable, Panel, FlexRow, Text, StatusIndicator, StatusIndicatorProps } from '@epam/uui';
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
                <FlexRow>
                    <StatusIndicator size="18" caption={ p.profileStatus } color={ p.profileStatus.toLowerCase() as StatusIndicatorProps['color'] } />
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
        width: 220,
    },
    {
        key: 'productionCategory',
        caption: 'Is Production',
        render: (r) => <Text>{r.productionCategory ? 'Yes' : 'No' }</Text>,
        width: 150,
    },
];

export default function WithTableExample() {
    const { api } = useUuiContext();

    const { tableState, setTableState } = useTableState<Person, any>();

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(tableState, setTableState);

    return (
        <Panel background="surface-main" style={ { height: '400px' } } shadow={ true }>
            <DataTable getRows={ view.getVisibleRows } columns={ personColumns } value={ tableState } onValueChange={ setTableState } { ...view.getListProps() } />
        </Panel>
    );
}
