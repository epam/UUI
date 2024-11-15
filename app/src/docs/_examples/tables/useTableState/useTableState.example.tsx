import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { DataColumnProps, getSeparatedValue, ITablePreset, LazyDataSource, TableFiltersConfig, useLazyDataSource, useTableState, useUuiContext } from '@epam/uui-core';
import { DataTable, Panel, FlexRow, Text, PresetsPanel, Badge, BadgeProps } from '@epam/uui';
import { Person } from '@epam/uui-docs';

const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 180,
        isSortable: true,
        isAlwaysVisible: true,
    }, {
        key: 'profileStatus',
        caption: 'Profile status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge indicator size="24" fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    }, {
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
    }, {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 200,
        isFilterActive: (f) => !!f.jobTitleId,
    }, {
        key: 'birthDate',
        caption: 'Birth date',
        render: (p) => p?.birthDate && <Text>{dayjs(p.birthDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    }, {
        key: 'hireDate',
        caption: 'Hire date',
        render: (p) => p?.hireDate && <Text>{dayjs(p.hireDate).format('MMM D, YYYY')}</Text>,
        width: 120,
        isSortable: true,
    },
];

const initialPresets: ITablePreset[] = [
    {
        id: -1,
        name: 'Red status',
        order: 'a',
        filter: {
            profileStatusId: 1,
        },
        isReadonly: true,
    },
];

export default function FiltersPanelExample() {
    const { api } = useUuiContext();

    const filtersConfig = useMemo<TableFiltersConfig<Person>[]>(
        () => [
            {
                field: 'profileStatusId',
                columnKey: 'profileStatus',
                title: 'Profile status',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: api.demo.statuses }),
            }, {
                field: 'jobTitleId',
                columnKey: 'jobTitle',
                title: 'Title',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: api.demo.jobTitles }),
            }, {
                field: 'salary',
                columnKey: 'salary',
                title: 'Salary',
                type: 'numeric',
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

    const tableStateApi = useTableState({
        filters: filtersConfig,
        initialPresets: initialPresets,
        onPresetCreate: api.presets.createPreset,
        onPresetUpdate: api.presets.updatePreset,
        onPresetDelete: api.presets.deletePreset,
    });
    const { tableState, setTableState } = tableStateApi;

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(tableState, setTableState);

    return (
        <Panel background="surface-main" shadow style={ { height: '400px' } }>
            <FlexRow padding="12" borderBottom>
                <PresetsPanel { ...tableStateApi } />
            </FlexRow>
            <DataTable
                getRows={ view.getVisibleRows }
                columns={ personColumns }
                value={ tableState }
                onValueChange={ setTableState }
                filters={ filtersConfig }
                { ...view.getListProps() }
            />
        </Panel>
    );
}
