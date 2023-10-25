import React, { useCallback, useMemo } from 'react';
import {
    DataTable,
    Panel,
    FlexRow,
    Text,
    Badge,
    EpamAdditionalColor,
    PresetsPanel,
    ModalBlocker,
    ModalWindow,
    ModalHeader,
    Button,
    FlexSpacer,
    ModalFooter,
    ScrollBars,
    SuccessNotification,
    WarningNotification,
    ErrorNotification,
} from '@epam/promo';
import {
    DataColumnProps, IModal, ITablePreset, LazyDataSource, TableFiltersConfig, useLazyDataSource, useTableState, useUuiContext,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import dayjs from 'dayjs';

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
                    <Badge fill="transparent" color={ p.profileStatus.toLowerCase() as EpamAdditionalColor } caption={ p.profileStatus } />
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

function BasicModalExample({ presetName, ...modalProps }: IModal<string> & { presetName: string }) {
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
                        <Button color="gray" fill="white" caption="Cancel" onClick={ () => modalProps.abort() } />
                        <Button color="blue" caption="Ok" onClick={ () => modalProps.success('Success action') } />
                    </ModalFooter>
                </Panel>
            </ModalWindow>
        </ModalBlocker>
    );
}

export default function PresetsPanelExample() {
    const svc = useUuiContext();
    const { uuiModals, uuiNotifications } = useUuiContext();

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

    const handlePresetDelete = useCallback((preset: ITablePreset<any, any>): Promise<void> => {
        const showSuccessToast = () => uuiNotifications
            .show((props) => (
                <SuccessNotification { ...props }>
                    <FlexRow alignItems="center">
                        <Text>Preset remove success</Text>
                    </FlexRow>
                </SuccessNotification>
            ))
            .catch(() => null);

        const showCancelToast = () => uuiNotifications
            .show((props) => (
                <WarningNotification { ...props }>
                    <FlexRow alignItems="center">
                        <Text>Cancel removal</Text>
                    </FlexRow>
                </WarningNotification>
            ))
            .catch(() => null);

        const showErrorToast = () => uuiNotifications
            .show((props) => (
                <ErrorNotification { ...props }>
                    <FlexRow alignItems="center">
                        <Text>Preset remove failure</Text>
                    </FlexRow>
                </ErrorNotification>
            ))
            .catch(() => null);

        return new Promise(
            (resolve, reject) => {
                uuiModals
                    .show<string>((props) => <BasicModalExample presetName={ preset.name } { ...props } />)
                    .then(() =>
                        svc.api.presets.deletePreset(preset)
                            .then(resolve)
                            .then(showSuccessToast)
                            .catch(showErrorToast))
                    .catch(() => showCancelToast().then(reject));
            },
        );
    }, [svc.api.presets, uuiModals, uuiNotifications]);

    const tableStateApi = useTableState({
        columns: personColumns,
        filters: filtersConfig,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: handlePresetDelete,
    });

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState);

    return (
        <Panel style={ { height: '400px' } }>
            <FlexRow>
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
