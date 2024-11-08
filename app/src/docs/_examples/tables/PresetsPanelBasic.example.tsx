import React, { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { DataColumnProps, IModal, ITablePreset, LazyDataSource, TableFiltersConfig, useLazyDataSource, useTableState, useUuiContext } from '@epam/uui-core';
import {
    DataTable, Panel, FlexRow, Text, PresetsPanel, Badge, ModalBlocker, ModalWindow, ModalFooter, Button, ScrollBars,
    ModalHeader, FlexSpacer, BadgeProps,
} from '@epam/uui';
import { Person } from '@epam/uui-docs';

const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{ p.name }</Text>,
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
        width: 160,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    }, {
        key: 'departmentName',
        caption: 'Department',
        render: (p) => <Text>{ p.departmentName }</Text>,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.departmentId,
    }, {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{ r.jobTitle }</Text>,
        width: 220,
        isSortable: true,
        isFilterActive: (f) => !!f.jobTitleId,
    }, {
        key: 'birthDate',
        caption: 'Birth date',
        render: (p) => p?.birthDate && <Text>{ dayjs(p.birthDate).format('MMM D, YYYY') }</Text>,
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
    }, {
        id: -2,
        name: 'Green status',
        order: 'b',
        filter: {
            profileStatusId: [3],
        },
    }, {
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
    const { uuiModals } = useUuiContext();

    const filtersConfig: TableFiltersConfig<Person>[] = useMemo(
        () => [
            {
                field: 'profileStatusId',
                columnKey: 'profileStatus',
                title: 'Profile status',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
            }, {
                field: 'jobTitleId',
                columnKey: 'jobTitle',
                title: 'Title',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
            }, {
                field: 'departmentId',
                columnKey: 'departmentName',
                title: 'Department',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
            }, {
                field: 'birthDate',
                columnKey: 'birthDate',
                title: 'Birth date',
                type: 'datePicker',
            },
        ],
        [],
    );

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
            backgroundReload: true,
        },
        [],
    );

    const handlePresetDelete = useCallback(async (preset: ITablePreset<any, any>): Promise<void> => {
        await uuiModals
            .show((props) => <RemovePresetConfirmationModal presetName={ preset.name } { ...props } />);
        await svc.api.presets.deletePreset(preset);
    }, [svc.api.presets, uuiModals]);

    const tableStateApi = useTableState({
        filters: filtersConfig,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: handlePresetDelete,
    });

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState);

    return (
        <Panel background="surface-main" shadow style={ { height: '400px' } }>
            <FlexRow padding="12">
                <PresetsPanel { ...tableStateApi } />
            </FlexRow>
            <DataTable
                getRows={ view.getVisibleRows }
                columns={ personColumns }
                filters={ filtersConfig }
                value={ tableStateApi.tableState }
                onValueChange={ tableStateApi.setTableState }
                { ...view.getListProps() }
            />
        </Panel>
    );
}

function RemovePresetConfirmationModal({ presetName, ...modalProps }: IModal<string> & { presetName: string }) {
    const content = `${presetName} will be deleted and can't be restored.`;
    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow>
                <Panel>
                    <ModalHeader title="Delete preset" onClose={ () => modalProps.abort() } />
                    <ScrollBars hasTopShadow hasBottomShadow>
                        <FlexRow padding="24">
                            <Text size="36">
                                { content }
                            </Text>
                        </FlexRow>
                    </ScrollBars>
                    <ModalFooter>
                        <FlexSpacer />
                        <Button color="neutral" fill="outline" caption="Cancel" onClick={ () => modalProps.abort() } />
                        <Button color="primary" caption="Ok" onClick={ () => modalProps.success('Success action') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}
