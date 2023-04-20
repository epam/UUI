import React, { useMemo } from 'react';
import { FiltersPanel, DataTable, Panel, FlexRow, Text, Badge, EpamAdditionalColor } from '@epam/promo';
import { defaultPredicates } from '@epam/uui';
import { DataColumnProps, getSeparatedValue, LazyDataSource, TableFiltersConfig, useLazyDataSource, useTableState, useUuiContext } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import dayjs from 'dayjs';

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
        caption: 'Profile Status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge fill="transparent" color={p.profileStatus.toLowerCase() as EpamAdditionalColor} caption={p.profileStatus} />
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    },
    {
        key: 'salary',
        caption: 'Salary',
        render: (p) => <Text>{getSeparatedValue(+p.salary, { style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2 }, 'en-US')}</Text>,
        width: 150,
        textAlign: 'right',
        isSortable: true,
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 200,
        isFilterActive: (f) => !!f.jobTitleId,
    },
    {
        key: 'birthDate',
        caption: 'Birth Date',
        render: (p) => p?.birthDate && <Text>{dayjs(p.birthDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'hireDate',
        caption: 'Hire Date',
        render: (p) => p?.hireDate && <Text>{dayjs(p.hireDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
];

export default function FiltersPanelExample() {
    const svc = useUuiContext();

    const filtersConfig: TableFiltersConfig<Person>[] = useMemo(
        () => [
            {
                field: 'profileStatusId',
                columnKey: 'profileStatus',
                title: 'Profile Status',
                type: 'multiPicker',
                isAlwaysVisible: true,
                dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
                predicates: defaultPredicates.multiPicker,
            },
            {
                field: 'jobTitleId',
                columnKey: 'jobTitle',
                title: 'Title',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
            },
            {
                field: 'salary',
                columnKey: 'salary',
                title: 'Salary',
                type: 'numeric',
                predicates: defaultPredicates.numeric,
            },
            {
                field: 'birthDate',
                columnKey: 'birthDate',
                title: 'Birth Date',
                type: 'datePicker',
            },
            {
                field: 'hireDate',
                columnKey: 'hireDate',
                title: 'Hire Date',
                type: 'rangeDatePicker',
                predicates: defaultPredicates.rangeDatePicker,
            },
        ],
        []
    );

    const { tableState, setTableState } = useTableState({
        columns: personColumns,
        filters: filtersConfig,
    });

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
        },
        []
    );

    const view = dataSource.useView(tableState, setTableState);

    return (
        <Panel style={{ height: '400px' }}>
            <FlexRow spacing="6" vPadding="12">
                <FiltersPanel filters={filtersConfig} tableState={tableState} setTableState={setTableState} />
            </FlexRow>
            <DataTable getRows={view.getVisibleRows} columns={personColumns} value={tableState} onValueChange={setTableState} {...view.getListProps()} />
        </Panel>
    );
}
