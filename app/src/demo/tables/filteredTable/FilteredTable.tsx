import React, {
    useCallback, useMemo, useState,
} from 'react';
import css from './FilteredTable.module.scss';
import {
    DataTable, FiltersPanel, FlexCell, FlexRow, PresetsPanel, Text,
} from '@epam/uui';
import { getFilters } from './filters';
import {
    useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest, ITablePreset,
    DataQueryFilter, useLazyDataSource,
} from '@epam/uui-core';
import { FilteredTableFooter } from './FilteredTableFooter';
import { Person } from '@epam/uui-docs';
import { personColumns } from './columns';
import { SearchInput } from '@epam/uui';
import { TApi } from '../../../data';

const defaultPresets: ITablePreset[] = [
    {
        name: 'All',
        id: -1,
        isReadonly: true,
        order: 'a',
    }, {
        name: 'My Team',
        id: -2,
        order: 'b',
        filter: {
            managerId: [13],
        },
        isReadonly: true,
    },
];

export function FilteredTable() {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);
    const [initialPresets] = useState<ITablePreset<DataQueryFilter<Person>>[]>([...defaultPresets, ...(JSON.parse(localStorage.getItem('presets')) || [])]);

    const tableStateApi = useTableState<DataQueryFilter<Person>>({
        filters: filters,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: rq.filter || {},
            page: rq.page,
            pageSize: rq.pageSize,
        });
        result.count = result.items.length;
        result.from = 0;
        return result;
    }, [svc.api.demo]);

    const dataSource = useLazyDataSource<Person, number, DataQueryFilter<Person>>(
        {
            api: api,
            selectAll: false,
            backgroundReload: true,
        },
        [],
    );

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions: {
            isSelectable: true,
            onClick: (rowProps) => {
                rowProps.onSelect(rowProps);
            },
        },
    });

    const searchHandler = (val: string | undefined) => tableStateApi.setTableState({
        ...tableStateApi.tableState,
        search: val,
    });

    const {
        setTableState, setFilter, setColumnsConfig, setFiltersConfig, ...presetsApi
    } = tableStateApi;

    const listProps = view.getListProps();

    return (
        <div className={ css.container }>
            <div className={ css.presetsPanel }>
                <Text fontSize="24" lineHeight="30" cx={ css.presetsTitle }>
                    Users Dashboard
                </Text>
                <PresetsPanel { ...presetsApi } />
            </div>
            <FlexRow cx={ css.filterPanelWrapper } borderBottom={ true }>
                <FlexRow cx={ css.filterPanel }>
                    <FiltersPanel filters={ filters } tableState={ tableStateApi.tableState } setTableState={ tableStateApi.setTableState } />
                </FlexRow>
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput value={ tableStateApi.tableState.search } onValueChange={ searchHandler } placeholder="Search" debounceDelay={ 1000 } />
                </FlexCell>
            </FlexRow>
            <DataTable
                headerTextCase="upper"
                getRows={ view.getVisibleRows }
                columns={ personColumns }
                value={ tableStateApi.tableState }
                onValueChange={ tableStateApi.setTableState }
                showColumnsConfig={ false }
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
                { ...listProps }
            />
            <FilteredTableFooter tableState={ tableStateApi.tableState } setTableState={ tableStateApi.setTableState } totalCount={ listProps.totalCount } />
        </div>
    );
}
