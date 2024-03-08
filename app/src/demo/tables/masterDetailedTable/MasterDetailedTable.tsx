import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    cx, useUuiContext, UuiContexts, ITablePreset, useTableState, DataRowProps, DataColumnProps,
} from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { DataTable } from '@epam/uui';
import css from './DemoTable.module.scss';
import type { TApi } from '../../../data';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { FilterPanel } from './FilterPanel';
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { SlidingPanel } from './SlidingPanel';
import { FilterPanelOpener } from './FilterPanelOpener';
import { PersonGroupBy, PersonFilters, PersonTableGroups, PersonTableIdGroups, PersonTableRecord, PersonTableRecordId, PersonTableFilter } from './types';
import { useLazyDataSourceWithGrouping } from './useLazyDataSourceWithGrouping';

export function MasterDetailedTable() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);
    const filters = useMemo(() => getFilters<PersonFilters['Person']>(), []);

    const tableStateApi = useTableState<PersonTableFilter>({
        columns: personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    useEffect(
        () => {
            svc.api.presets.getPresets().then(setInitialPresets).catch(console.error);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const pin = useCallback(
        ({ value: { __typename } }: DataRowProps<PersonTableRecord, PersonTableRecordId[]>) => 
            __typename !== 'Person',
        [],
    );

    const clickHandler = useCallback((rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId[]>) => {
        if (rowProps.value.__typename === 'Person') {
            rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        }
    }, []);

    const dataSource = useLazyDataSourceWithGrouping<PersonTableGroups, PersonTableIdGroups, PersonFilters, PersonGroupBy>(
        (config) => {
            return config
                .addDefaults({
                    getType: ({ __typename }) => __typename,
                    getGroupBy: () => tableStateApi.tableState.filter?.groupBy,
                    complexIds: true,
                    backgroundReload: true,
                    fetchStrategy: 'parallel',
                    cascadeSelection: true,
                    rowOptions: {
                        checkbox: { isVisible: true },
                        isSelectable: true,
                        pin,
                        onClick: clickHandler,
                    },
                })
                .addEntity('Person', {
                    getFilter: (filter) => filter,
                    api: svc.api.demo.persons,
                })
                .addGrouping(['department', 'jobTitle'], {
                    type: 'PersonEmploymentGroup',
                    getChildCount: (group) => group.count,
                    getFilter: (filter) => filter,
                    api: svc.api.demo.personGroups,
                })
                .addGrouping(['country', 'city'], {
                    type: 'PersonLocationGroup',
                    getChildCount: (group) => group.count,
                    getFilter: (filter) => filter,
                    api: svc.api.demo.personGroups,
                });
        },
        [tableStateApi.tableState.filter?.groupBy],
    );

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {});

    const panelInfo = tableStateApi.tableState.selectedId && (view.getById(tableStateApi.tableState.selectedId, 0).value);
    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener isFilterPanelOpened={ isFilterPanelOpened } setIsFilterPanelOpened={ setIsFilterPanelOpened } />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel<PersonTableFilter>
                    { ...tableStateApi }
                    filters={ filters }
                    columns={ personColumns }
                    closePanel={ () => setIsFilterPanelOpened(false) }
                />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow borderBottom cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }></FlexRow>
                <DataTable
                    headerTextCase="upper"
                    getRows={ view.getVisibleRows }
                    columns={ personColumns as DataColumnProps<PersonTableRecord, PersonTableRecordId[], PersonTableFilter>[] }
                    filters={ filters }
                    value={ tableStateApi.tableState }
                    onValueChange={ tableStateApi.setTableState }
                    showColumnsConfig={ true }
                    allowColumnsResizing
                    allowColumnsReordering
                    { ...view.getListProps() }
                />
            </div>

            <InfoSidebarPanel
                data={ panelInfo }
                isVisible={ isInfoPanelOpened }
                onClose={ closeInfoPanel }
            />
        </div>
    );
}
