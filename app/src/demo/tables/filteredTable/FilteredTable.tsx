import React, { useCallback, useEffect, useMemo, useState } from 'react';
import css from './FilteredTable.scss';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest, ITablePreset } from "@epam/uui-core";
import { DataTable, FiltersToolbar, FlexCell, FlexRow, PresetPanel } from '@epam/promo';
import { getFilters } from './filters';
import { FilteredTableFooter } from "./FilteredTableFooter";
import { mapFilter } from "../masterDetailedTable/data";
import { Person } from '@epam/uui-docs';
import { SearchInput } from "@epam/uui";
import { TApi } from "../../../data";
import { personColumns } from './columns';

export const FilteredTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);
    const [totalCount, setTotalCount] = useState(0);
    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);

    useEffect(() => {
        svc.api.presets.getPresets()
            .then(setInitialPresets)
            .catch(console.error);
    }, []);

    const tableStateApi = useTableState({
        columns: personColumns,
        initialPresets: initialPresets,
        onPresetCreate: svc.api.presets.createPreset,
        onPresetUpdate: svc.api.presets.updatePreset,
        onPresetDelete: svc.api.presets.deletePreset,
    });

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: mapFilter(rq.filter || {}),
            page: rq.page - 1,
            pageSize: tableStateApi.tableState.pageSize || rq.pageSize,
        });
        setTotalCount(() => result.totalCount);
        result.count = result.items.length;
        result.totalCount = result.items.length;
        result.from = 0;
        return result;
    }, [tableStateApi.tableState.page, tableStateApi.tableState.pageSize]);

    const dataSource = useLazyDataSource<Person, number, Person>({ api }, [api]);

    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions: {
            checkbox: { isVisible: true },
            isSelectable: true,
        },
    });

    const searchHandler = (val: string | undefined) => tableStateApi.setTableState({ ...tableStateApi.tableState, search: val });

    const { setTableState, setFilter, setColumnsConfig, setFiltersConfig, ...presetsApi } = tableStateApi;

    const dataTableApi = {
        headerTextCase: "upper" as "upper" | "normal",
        getRows: () => view.getVisibleRows(),
        columns: personColumns,
        filters: filters,
        value: tableStateApi.tableState,
        onValueChange: tableStateApi.setTableState,
        showColumnsConfig: true,
        allowColumnsResizing: true,
        allowColumnsReordering: true,
        ...view.getListProps(),
    };

    return (
        <div className={ css.container }>
            <div className={ css.presetsPanel }>
                <PresetPanel { ...presetsApi } />
            </div>
            <FlexRow cx={ css.filterPanelWrapper } background="gray5" borderBottom={ true }>
                <FlexRow cx={ css.filterPanel }>
                    <FiltersToolbar
                        filters={ filters }
                        tableState={ tableStateApi.tableState }
                        setTableState={ tableStateApi.setTableState }
                    />
                </FlexRow>
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput
                        value={ tableStateApi.tableState.search }
                        onValueChange={ searchHandler }
                        placeholder="Search"
                        debounceDelay={ 1000 }
                    />
                </FlexCell>
            </FlexRow>
            <DataTable { ...dataTableApi }/>
            <FilteredTableFooter
                tableState={ tableStateApi.tableState }
                setTableState={ tableStateApi.setTableState }
                totalCount={ totalCount }
            />
        </div>
    );
};