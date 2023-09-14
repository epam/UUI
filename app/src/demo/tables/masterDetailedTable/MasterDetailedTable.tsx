import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    cx, useUuiContext, UuiContexts, ITablePreset, useTableState, DataRowProps,
    LazyDataSourceApiRequest, DataColumnProps, LazyDataSourceApiRequestContext,
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
    const filters = useMemo(() => getFilters<PersonTableFilter>(), []);
    const groupings = useMemo(() => groupingsList, []);

    useEffect(
        () => { svc.api.presets.getPresets().then(setInitialPresets).catch(console.error); },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const tableStateApi = useTableState<PersonTableFilter>({
        columns: personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const pin = useCallback(
        ({ value: { __typename } }: DataRowProps<PersonTableRecord, PersonTableRecordId>) => 
            __typename !== 'Person',
        [],
    );

    const clickHandler = useCallback((rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        if (rowProps.value.__typename === 'Person') {
            rowProps.onSelect(rowProps);
            setIsInfoPanelOpened(true);
        }
    }, []);

    const dataSource = useLazyDataSourceWithGrouping<PersonTableGroups, PersonTableIdGroups, { groupBy: 'department' }>(
        (config) => {        
            const getPersons = async (
                personRequest: LazyDataSourceApiRequest<PersonTableRecord, number, PersonTableFilter>,
                ctx: LazyDataSourceApiRequestContext<PersonTableRecord, unknown>,
            ) => {
                const { groupBy, ...filter } = personRequest.filter ?? {};
                if (groupBy && !ctx.parent) {
                    const personGroupsResponse = await svc.api.demo.personGroups({
                        ...personRequest,
                        filter: { groupBy },
                        search: null,
                        itemsRequest: { filter, search: personRequest.search },
                    } as any);
                    return personGroupsResponse;
                }
                const personsResponse = await svc.api.demo.persons(personRequest);
                return personsResponse;
            };
            
            return config
                .addDefault({
                    getType: ({ __typename }) => __typename,
                    getGroupBy: () => tableStateApi.tableState.filter?.groupBy,

                    complexIds: true,
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
                .addGrouping('location', {
                    type: 'Location',
                    getParentId: (loc) => loc.parentId,
                    getChildCount: (location) => location.type === 'city' ? 1 : 10,
                    api: async ({ ids, ...request }, ctx) => {
                        if (ids != null) {
                            return await svc.api.demo.locations({ ids });
                        }

                        if (!ctx.parent) {
                            return svc.api.demo.locations({ range: request.range, filter: { parentId: { isNull: true } } });
                        }
                        if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
                            return svc.api.demo.locations({ range: request.range, filter: { parentId: ctx.parent.id } });
                        }
                        return getPersons({ range: request.range, filter: { locationId: ctx.parent.id } }, ctx);
                    },
                })
                .addGrouping(['jobTitle', 'department'], {
                    type: 'PersonGroup',
                    getParentId: () => null,
                    getChildCount: (group) => group.count,
                    api: async ({ ids, ...request }, ctx) => {
                        const { groupBy, ...filter } = request.filter ?? {};
                        console.log('here', groupBy);
                        if (ids != null) {
                            return await svc.api.demo.personGroups({ ids });
                        }

                        if (groupBy && !ctx.parent) {
                            return getPersons({ ...request, filter: { groupBy }, search: null, itemsRequest: { filter, search: request.search } } as any, ctx);
                        }
                        
                        const parentFilter = ctx.parent && { [`${groupBy}Id`]: ctx.parent.id };
                        return getPersons({ ...request, filter: { ...filter, ...parentFilter } }, ctx);
                    },
                })
                .addEntity('Person', {
                    getParentId: () => undefined,
                    getChildCount: () => null,
                    api: async ({ ids, ...request }, ctx) => {
                        const { groupBy, ...filter } = request.filter ?? {};
                        if (ids != null) {
                            return await svc.api.demo.persons({ ids });
                        }
                        if (request.search) {
                            return getPersons({ ...request, filter }, ctx);
                        }

                        const parentFilter = ctx.parent && { [`${groupBy}Id`]: ctx.parent.id };
                        return getPersons({ ...request, filter: { ...filter, ...parentFilter } }, ctx);
                    },
                });
        },
        [tableStateApi.tableState.filter?.groupBy],
    );

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {});

    const panelInfo = tableStateApi.tableState.selectedId && (view.getById(tableStateApi.tableState.selectedId, 0).value);

    console.log('here');
    return (
        <div className={ css.wrapper }>
            <FilterPanelOpener isFilterPanelOpened={ isFilterPanelOpened } setIsFilterPanelOpened={ setIsFilterPanelOpened } />

            <SlidingPanel isVisible={ isFilterPanelOpened } width={ 288 } position="left">
                <FilterPanel<PersonTableFilter>
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
                    columns={ personColumns as DataColumnProps<PersonTableRecord, PersonTableRecordId, PersonTableFilter>[] }
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
