import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    cx, useUuiContext, UuiContexts, ITablePreset, useTableState, DataRowProps, DataColumnProps,
} from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { DataTable } from '@epam/promo';
import css from './DemoTable.module.scss';
import type { TApi } from '../../../data';
import { groupings as groupingsList } from './groupings'; 
import { getFilters } from './filters';
import { personColumns } from './columns';
import { FilterPanel } from './FilterPanel';
import { InfoSidebarPanel } from './InfoSidebarPanel';
import { SlidingPanel } from './SlidingPanel';
import { FilterPanelOpener } from './FilterPanelOpener';
import { PersonTableFilter, PersonTableGroups, PersonTableIdGroups, PersonTableRecord, PersonTableRecordId } from './types';
import { useLazyDataSourceWithGrouping } from './useLazyDataSourceWithGrouping';

export function MasterDetailedTable() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const [isFilterPanelOpened, setIsFilterPanelOpened] = useState(false);
    const [isInfoPanelOpened, setIsInfoPanelOpened] = useState(false);
    const closeInfoPanel = useCallback(() => setIsInfoPanelOpened(false), []);

    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);
    const filters = useMemo(() => getFilters<PersonTableFilter['Person']>(), []);
    const groupings = useMemo(() => groupingsList, []);

    useEffect(
        () => { svc.api.presets.getPresets().then(setInitialPresets).catch(console.error); },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const tableStateApi = useTableState<PersonTableFilter['Person']>({
        columns: personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

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

    const dataSource = useLazyDataSourceWithGrouping<PersonTableGroups, PersonTableIdGroups, PersonTableFilter>(
        (config) => config
            .addDefault({
                getType: ({ __typename }) => __typename,
                getGroupBy: () => tableStateApi.tableState.filter?.groupBy,
                backgroundReload: true,
                fetchStrategy: tableStateApi.tableState.filter?.groupBy === 'location' ? 'sequential' : 'parallel',
                selectAll: tableStateApi.tableState.filter?.groupBy === 'location' ? false : true,
                cascadeSelection: true,
                rowOptions: {
                    checkbox: { isVisible: true },
                    isSelectable: true,
                    pin,
                    onClick: clickHandler,
                },
            })
            .addEntity('Person', {
                getFilter: ({ location, department, jobTitle }) => ({
                    ...(location ? { locationId: location } : {}),
                    ...(department ? { departmentId: department as number } : {}),
                    ...(jobTitle ? { jobTitleId: jobTitle as number } : {}),
                }),
                api: async ({ ids, ...request }) => {
                    const { groupBy, ...filter } = request.filter ?? {};
                    if (ids != null) {
                        return await svc.api.demo.persons({ ids });
                    }
                    return await svc.api.demo.persons({ ...request, filter });
                },
            })
            .addGrouping('location', {
                type: 'Location',

                isLastNestingLevel: (location) => location.type === 'city',

                getRowOptions: () => ({ checkbox: { isVisible: false } }),
                getChildCount: (location) => location.type === 'city' ? 1 : 10,
                api: async ({ ids, ...request }, ctx) => {
                    if (ids != null) {
                        return await svc.api.demo.locations({ ids });
                    }

                    if (!ctx.parent || ctx.parent.__typename !== 'Location') {
                        return svc.api.demo.locations({ range: request.range, filter: { parentId: { isNull: true } } });
                    }

                    return svc.api.demo.locations({ range: request.range, filter: { parentId: ctx.parent.id } });
                },
            })
            .addGrouping(['jobTitle', 'department'], {
                type: 'PersonGroup',
                getChildCount: (group) => group.count,
                getFilter: ({ department, jobTitle }) => ({
                    ...(department ? { departmentId: department as number } : {}),
                    ...(jobTitle ? { jobTitleId: jobTitle as number } : {}),
                }),
                api: async ({ ids, ...request }) => {
                    const { groupBy, ...filter } = request.filter ?? {};
                    if (ids != null) {
                        return await svc.api.demo.personGroups({ ids });
                    }
 
                    // TODO: check case, when groupBy is not passed
                    if (groupBy) {
                        return await svc.api.demo.personGroups(
                            { ...request, filter: { groupBy }, search: null, itemsRequest: { filter, search: request.search } } as any,
                        );
                    }
 
                    return await svc.api.demo.personGroups(
                        { ...request, filter, search: null, itemsRequest: { filter, search: request.search } } as any,
                    );
                },
            }),
        [JSON.stringify(tableStateApi.tableState.filter?.groupBy)],
    );

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {});

    const panelInfo = tableStateApi.tableState.selectedId && (view.getById(tableStateApi.tableState.selectedId, 0).value);
    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener isFilterPanelOpened={ isFilterPanelOpened } setIsFilterPanelOpened={ setIsFilterPanelOpened } />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel<PersonTableFilter['Person']>
                    { ...tableStateApi }
                    filters={ filters }
                    columns={ personColumns }
                    groupings={ groupings }
                    closePanel={ () => setIsFilterPanelOpened(false) }
                />
            </SlidingPanel>

            <div className={ css.container }>
                <FlexRow borderBottom cx={ cx(css.presets, { [css.presetsWithFilter]: isFilterPanelOpened }) }></FlexRow>

                <DataTable
                    headerTextCase="upper"
                    getRows={ view.getVisibleRows }
                    columns={ personColumns as DataColumnProps<PersonTableRecord, PersonTableRecordId[], PersonTableFilter['Person']>[] }
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
