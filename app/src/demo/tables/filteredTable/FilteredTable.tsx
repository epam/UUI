import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest, useArrayDataSource, ITablePreset } from "@epam/uui-core";
import { DataTable, FiltersToolbar, FlexCell, FlexRow, PageButton, Paginator, LabeledInput, TextInput, PickerInput, PresetPanel } from '@epam/promo';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { mapFilter } from "../masterDetailedTable/data";
import { SearchInput } from "@epam/uui";
import { TApi } from "../../../data";
import { ReactComponent as ArrowRightIcon_24 } from "@epam/assets/icons/common/navigation-chevron-right-18.svg";
import css from './FilteredTable.scss';

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

    const goToPageHandler = (newValue: string) => {
        if (typeof +newValue === 'number' && !isNaN(+newValue) && +newValue <= totalPages() && +newValue > 0) {
            setGoToPage(() => newValue);
        }
    };

    return (
        <div className={ css.container }>
            <div className={ css.presetsPanel }>
                <PresetPanel
                    presets={ tableStateApi.presets }
                    createNewPreset={ tableStateApi.createNewPreset }
                    isDefaultPresetActive={ tableStateApi.isDefaultPresetActive }
                    resetToDefault={ tableStateApi.resetToDefault }
                    activePresetId={ tableStateApi.activePresetId }
                    hasPresetChanged={ tableStateApi.hasPresetChanged }
                    choosePreset={ tableStateApi.choosePreset }
                    duplicatePreset={ tableStateApi.duplicatePreset }
                    updatePreset={ tableStateApi.updatePreset }
                    deletePreset={ tableStateApi.deletePreset }
                    tableState={ tableStateApi.tableState }
                />
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
                        onValueChange={ (val) => tableStateApi.setTableState({ ...tableStateApi.tableState, search: val }) }
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
            <FlexRow cx={ css.paginatorWrapper } padding="24" vPadding="12" background="gray5">
                <div className={ css.itemsPerPage }>
                    <LabeledInput size="24" label="Items per page" labelPosition="left">
                        <PickerInput
                            size="24"
                            placeholder="Select items per page"
                            dataSource={ itemsPerPageDataSource }
                            value={ tableStateApi.tableState.pageSize }
                            onValueChange={ setItemsPerPage }
                            getName={ item => item.page }
                            selectionMode="single"
                            valueType={ 'id' }
                            sorting={ { field: 'page', direction: 'asc' } }
                            disableClear
                            searchPosition="none"
                        />
                    </LabeledInput>
                </div>
                <div>
                    <LabeledInput size="24" label="Go to page" labelPosition="left">
                        <TextInput
                            cx={ css.goToPage }
                            size="24"
                            value={ goToPage }
                            onValueChange={ goToPageHandler }
                        />
                    </LabeledInput>
                </div>
                <PageButton
                    cx={ css.goToPageButton }
                    size="24"
                    icon={ ArrowRightIcon_24 }
                    onClick={ () => tableStateApi.setTableState({ ...tableStateApi.tableState, page: +goToPage, indexToScroll: 0 }) }
                    fill="white"
                    color="gray50"
                />
                <Paginator
                    value={ tableStateApi.tableState.page }
                    onValueChange={ newPage => tableStateApi.setTableState({ ...tableStateApi.tableState, page: newPage, indexToScroll: 0 }) }
                    totalPages={ totalPages() }
                    size="24"
                />
            </FlexRow>
        </div>
    );
};