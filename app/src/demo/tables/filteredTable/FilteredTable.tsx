import React, { useCallback, useEffect, useMemo, useState } from 'react';
import css from './FilteredTable.scss';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest, useArrayDataSource, ITablePreset } from "@epam/uui-core";
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
    const [goToPage, setGoToPage] = useState('1');
    const [initialPresets, setInitialPresets] = useState<ITablePreset[]>([]);

    const itemsPerPageDataSource = useArrayDataSource({
        items: [{ id: 40, page: "40" }, { id: 80, page: "80" }, { id: 120, page: "120" }, { id: 160, page: "160" }],
    }, []);

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

    const totalPages = () => tableStateApi.tableState.pageSize ? Math.ceil(totalCount / tableStateApi.tableState.pageSize) : 0;

    const setItemsPerPage = (itemsPerPage: number) => {
        tableStateApi.setTableState({ ...tableStateApi.tableState, page: 1, pageSize: itemsPerPage });
        setGoToPage('1');
    };

    useEffect(() => {
        setItemsPerPage(40);
    }, []);

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

    const setGoToPageHandler = (newValue: string) => {
        if (typeof +newValue === 'number' && !isNaN(+newValue) && +newValue <= totalPages() && +newValue > 0) {
            setGoToPage(() => newValue);
        }
    };

    const goToPageHandler = () => tableStateApi.setTableState({ ...tableStateApi.tableState, page: +goToPage, indexToScroll: 0 });

    const searchHandler = (val: string | undefined) => tableStateApi.setTableState({ ...tableStateApi.tableState, search: val });

    const paginatorHandler = (newPage: number) => tableStateApi.setTableState({ ...tableStateApi.tableState, page: newPage, indexToScroll: 0 });

    const { setTableState, setFilter, setColumnsConfig, setFiltersConfig, ...presetsApi } = tableStateApi;

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
            <DataTable
                headerTextCase="upper"
                getRows={ view.getVisibleRows }
                columns={ personColumns }
                filters={ filters }
                value={ tableStateApi.tableState }
                onValueChange={ tableStateApi.setTableState }
                showColumnsConfig={ true }
                allowColumnsResizing
                allowColumnsReordering
                { ...view.getListProps() }
            />
            <FilteredTableFooter
                itemsPerPageDataSource={ itemsPerPageDataSource }
                tableStateApi={ tableStateApi }
                setItemsPerPage={ setItemsPerPage }
                goToPage={ goToPage }
                setGoToPageHandler={ setGoToPageHandler }
                goToPageHandler={ goToPageHandler }
                paginatorHandler={ paginatorHandler }
                totalPages={ totalPages }/>
        </div>
    );
};