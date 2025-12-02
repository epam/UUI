import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DataColumnProps, useLazyDataSource, useUuiContext, TableFiltersConfig, LazyDataSource, DataTableState, getSeparatedValue } from '@epam/uui-core';
import { Text, DataTable, Panel, FlexRow, Badge, BadgeProps, defaultPredicates } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 180,
        isSortable: true,
    },
    {
        key: 'profileStatus',
        caption: 'Profile status',
        info: 'This person profile status information',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge indicator size="24" fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
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
        width: 100,
        textAlign: 'right',
        isSortable: true,
        isFilterActive: (f) => !!f.salary,
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
        caption: 'Birth date',
        render: (p) => p?.birthDate && <Text>{dayjs(p.birthDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'hireDate',
        caption: 'Hire date',
        render: (p) => p?.hireDate && <Text>{dayjs(p.hireDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'actions',
        render: () => {},
        width: 50,
        fix: 'right',
        allowResizing: false,
    },
];

export default function ColumnFiltersTableExample() {
    const { api } = useUuiContext();

    const filtersConfig = useMemo<TableFiltersConfig<Person>[]>(
        () => [
            {
                field: 'profileStatusId',
                columnKey: 'profileStatus',
                title: 'Profile status',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: api.demo.statuses }),
                showSearch: false,
            }, {
                field: 'jobTitleId',
                columnKey: 'jobTitle',
                title: 'Title',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: api.demo.jobTitles }),
                predicates: defaultPredicates.multiPicker,
            }, {
                field: 'salary',
                columnKey: 'salary',
                title: 'Salary',
                type: 'numeric',
                predicates: defaultPredicates.numeric,
            }, {
                field: 'birthDate',
                columnKey: 'birthDate',
                title: 'Birth date',
                type: 'datePicker',
            }, {
                field: 'hireDate',
                columnKey: 'hireDate',
                title: 'Hire date',
                type: 'rangeDatePicker',
            },
        ],
        [api.demo.jobTitles, api.demo.statuses],
    );
    const [value, onValueChange] = useState<DataTableState>({});

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({
            checkbox: { isVisible: true },
        }),
    });

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                getRows={ view.getVisibleRows }
                columns={ personColumns }
                value={ value }
                onValueChange={ onValueChange }
                headerTextCase="upper"
                allowColumnsReordering={ true }
                allowColumnsResizing={ true }
                showColumnsConfig={ true }
                filters={ filtersConfig }
                { ...view.getListProps() }
            />
        </Panel>
    );
}
