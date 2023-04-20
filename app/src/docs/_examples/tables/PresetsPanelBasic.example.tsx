import React, { useMemo } from 'react';
import { DataTable, Panel, FlexRow, Text, Badge, EpamAdditionalColor, PresetsPanel } from '@epam/promo';
import { DataColumnProps, ITablePreset, LazyDataSource, TableFiltersConfig, useLazyDataSource, useTableState, useUuiContext } from '@epam/uui-core';
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
        width: 160,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    },
    {
        key: 'departmentName',
        caption: 'Department',
        render: (p) => <Text>{p.departmentName}</Text>,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.departmentId,
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 220,
        isSortable: true,
        isFilterActive: (f) => !!f.jobTitleId,
    },
    {
        key: 'birthDate',
        caption: 'Birth Date',
        render: (p) => p?.birthDate && <Text>{dayjs(p.birthDate).format('MMM D, YYYY')}</Text>,
        width: 140,
        isSortable: true,
    },
];

const initialPresets: ITablePreset[] = [
    {
        id: -1,
        name: 'All',
        order: 'a',
        isReadonly: true,
    },
    {
        id: -2,
        name: 'Green status',
        order: 'b',
        filter: {
            profileStatusId: [3],
        },
    },
    {
        id: -3,
        name: 'Red status',
        order: 'c',
        filter: {
            profileStatusId: [1],
        },
    },
];

export default function PresetsPanelExample() {
    const svc = useUuiContext();

    const filtersConfig: TableFiltersConfig<Person>[] = useMemo(
        () => [
            {
                field: 'profileStatusId',
                columnKey: 'profileStatus',
                title: 'Profile Status',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
            },
            {
                field: 'jobTitleId',
                columnKey: 'jobTitle',
                title: 'Title',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
            },
            {
                field: 'departmentId',
                columnKey: 'departmentName',
                title: 'Department',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
            },
            {
                field: 'birthDate',
                columnKey: 'birthDate',
                title: 'Birth Date',
                type: 'datePicker',
            },
        ],
        []
    );

    const tableStateApi = useTableState({
        columns: personColumns,
        filters: filtersConfig,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
        },
        []
    );

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState);

    return (
        <Panel style={{ height: '400px' }}>
            <FlexRow>
                <PresetsPanel {...tableStateApi} />
            </FlexRow>
            <DataTable
                getRows={view.getVisibleRows}
                columns={personColumns}
                filters={filtersConfig}
                value={tableStateApi.tableState}
                onValueChange={tableStateApi.setTableState}
                {...view.getListProps()}
            />
        </Panel>
    );
}
