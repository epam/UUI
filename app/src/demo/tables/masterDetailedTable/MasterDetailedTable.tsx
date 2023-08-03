import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { Person } from '@epam/uui-docs';
import {
    cx, useLazyDataSource, useUuiContext, UuiContexts, ITablePreset, useTableState, DataRowProps,
    LazyDataSourceApi, LazyDataSourceApiResponse, LazyDataSourceApiRequest, DataColumnProps,
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
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId, PersonTableRecordType } from './types';

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

    const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = async (request, ctx) => {
        const { ids, filter: requestFilter, ...rq } = request;

        if (ids != null) {
            const idsByType: Record<PersonTableRecordType, (string | number)[]> = {} as any;
            ids.forEach(([type, id]) => {
                idsByType[type] = idsByType[type] || [];
                idsByType[type].push(id);
            });

            const typesToLoad = Object.keys(idsByType) as PersonTableRecordType[];
            const response: LazyDataSourceApiResponse<PersonTableRecord> = { items: [] };

            const promises = typesToLoad.map(async (type) => {
                const idsRequest: LazyDataSourceApiRequest<any, any> = { ids: idsByType[type] };
                
                let apiRequest = null;
                if (type === 'Person') {
                    apiRequest = svc.api.demo.persons; 
                }
                
                if (type === 'PersonGroup') { 
                    apiRequest = svc.api.demo.personGroups;
                } 
                
                if (type === 'Location') { 
                    apiRequest = svc.api.demo.locations;
                }

                const apiResponse = await apiRequest(idsRequest);
                response.items = [...response.items, ...apiResponse.items];
            });

            await Promise.all(promises);
            return response;
        }

        const { groupBy, ...filter } = (requestFilter as PersonTableFilter) || {};

        const getPersons = async (personRequest: LazyDataSourceApiRequest<Person, number>) => {
            if (groupBy && !ctx.parent) {
                const personGroupsResponse = await svc.api.demo.personGroups({
                    ...personRequest,
                    filter: { groupBy },
                    search: null,
                    itemsRequest: { filter, search: personRequest.search },
                    ids,
                } as any);
                return personGroupsResponse;
            } else {
                const personsResponse = await svc.api.demo.persons(personRequest);
                return personsResponse;
            }
        };

        if (request.search) {
            return getPersons({ ...rq, filter });
        } else if (groupBy === 'location') {
            if (!ctx.parent) {
                return svc.api.demo.locations({ range: rq.range, filter: { parentId: { isNull: true } } });
            } else if (ctx.parent.__typename === 'Location' && ctx.parent.type !== 'city') {
                return svc.api.demo.locations({ range: rq.range, filter: { parentId: ctx.parent.id } });
            } else {
                return getPersons({ range: rq.range, filter: { locationId: ctx.parent.id } });
            }
        } else if (groupBy && !ctx.parent) {
            return getPersons({
                ...rq,
                filter: { groupBy },
                search: null,
                itemsRequest: { filter, search: rq.search },
                ids,
            } as any);
        } else {
            const parentFilter = ctx.parent && { [`${groupBy}Id`]: ctx.parent.id };
            return getPersons({ ...rq, filter: { ...filter, ...parentFilter } });
        }
    };

    const dataSource = useLazyDataSource<PersonTableRecord, PersonTableRecordId, PersonTableFilter>(
        {
            api,
            getId: (i) => [i.__typename, i.id],
            complexIds: true,
            getParentId: (i) => {
                const groupBy = tableStateApi.tableState.filter?.groupBy;
                if (i.__typename === 'PersonGroup') {
                    return null;
                } else if (i.__typename === 'Location') {
                    return i.parentId ? ['Location', i.parentId] : undefined;
                } else if (i.__typename === 'Person') {
                    if (groupBy === 'location') {
                        return ['Location', i.locationId];
                    } else if (groupBy === 'jobTitle') {
                        return ['PersonGroup', i.jobTitleId];
                    } else if (groupBy === 'department') {
                        return ['PersonGroup', i.departmentId];
                    } else {
                        return undefined;
                    }
                }
    
                throw new Error('PersonTableDemo: unknown typename/groupBy combination');
            },
        },
        [],
    );

    const clickHandler = useCallback((rowProps: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        rowProps.onSelect(rowProps);
        setIsInfoPanelOpened(true);
    }, []);

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        getChildCount: (item) => {
            if (item.__typename === 'PersonGroup') {
                return item.count;
            } 
            if (item.__typename === 'Location') {
                return item.type === 'city' ? 1 : 10;
            } 
            return null;
        },
        fetchStrategy: tableStateApi.tableState.filter?.groupBy === 'location' ? 'sequential' : 'parallel',
        rowOptions: {
            checkbox: { isVisible: true },
            isSelectable: true,
            onClick: clickHandler,
        },
        cascadeSelection: true,
    });

    const panelInfo = tableStateApi.tableState.selectedId && (view.getById(tableStateApi.tableState.selectedId, 0).value);

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
                    columns={ personColumns as DataColumnProps<PersonTableRecord, PersonTableRecordId, any>[] }
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
