import React, { useCallback, useMemo, useState, useEffect } from 'react';
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

    // --- Presets API Imitation using localStorage ---
    // Key for localStorage
    const PRESETS_KEY = 'presetsPanelExample.presets';

    // Load presets from localStorage or fallback to initialPresets
    const loadPresets = () => {
        try {
            const raw = localStorage.getItem(PRESETS_KEY);
            if (raw) return JSON.parse(raw);
        } catch {}
        return [...initialPresets];
    };

    // Find the next available positive ID (ignoring negative IDs for built-ins)
    const getNextId = (presets: ITablePreset[]) => {
        const max = presets.reduce((acc, p) => (typeof p.id === 'number' && p.id > acc ? p.id : acc), 0);
        return max + 1;
    };

    // State for presets and nextId
    const [presets, setPresets] = useState<ITablePreset[]>(loadPresets());
    const [nextId, setNextId] = useState(() => getNextId(loadPresets()));

    // Save presets to localStorage
    const savePresets = (newPresets: ITablePreset[]) => {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(newPresets));
    };

    // --- CRUD handlers (imitating async API) ---
    const createPreset = useCallback(async (preset: ITablePreset) => {
        const id = nextId;
        setNextId(id + 1);
        const newPreset = { ...preset, id };
        setPresets((prev) => {
            const updated = [...prev, newPreset];
            savePresets(updated);
            return updated;
        });
        return id;
    }, [nextId]);

    const updatePreset = useCallback(async (preset: ITablePreset) => {
        setPresets((prev) => {
            const updated = prev.map((p) => p.id === preset.id ? { ...preset } : p);
            savePresets(updated);
            return updated;
        });
    }, []);

    const deletePreset = useCallback(async (preset: ITablePreset) => {
        setPresets((prev) => {
            const updated = prev.filter((p) => p.id !== preset.id);
            savePresets(updated);
            return updated;
        });
    }, []);

    // --- Confirmation modal for delete (UI only, not API) ---
    const handlePresetDelete = useCallback(async (preset: ITablePreset<any, any>): Promise<void> => {
        await uuiModals
            .show((props) => <RemovePresetConfirmationModal presetName={ preset.name } { ...props } />);
        deletePreset(preset);
    }, [deletePreset, uuiModals]);

    // --- Table state and data ---
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

    const tableStateApi = useTableState({
        filters: filtersConfig,
        initialPresets: presets,
        onPresetCreate: createPreset,
        onPresetUpdate: updatePreset,
        onPresetDelete: handlePresetDelete,
    });

    // Keep local state in sync with useTableState (for UI consistency)
    useEffect(() => {
        if (tableStateApi.presets !== presets) {
            setPresets(tableStateApi.presets);
            savePresets(tableStateApi.presets);
        }
    }, [tableStateApi.presets]);

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState);

    return (
        <Panel background="surface-main" shadow style={ { height: '400px' } }>
            <FlexRow padding="12" borderBottom>
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
