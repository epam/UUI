import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest, useArrayDataSource } from "@epam/uui-core";
import { DataTable, FiltersToolbar, FlexCell, FlexRow, PageButton, Paginator, Text, LabeledInput, TextInput, PickerInput } from '@epam/promo';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { mapFilter } from "../masterDetailedTable/data";
import { SearchInput } from "@epam/uui";
import { TApi } from "../../../data";
import css from './FilteredTable.scss';
import { ReactComponent as ArrowRightIcon_24 } from "@epam/assets/icons/common/navigation-chevron-right-18.svg";

export const FilteredTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);
    const [totalCount, setTotalCount] = useState(0);
    const { tableState, setTableState } = useTableState({ columns: personColumns });
    const [goToPage, setGoToPage] = useState('1');

    const totalPages = () => tableState.pageSize ? Math.ceil(totalCount / tableState.pageSize) : 0;

    const itemsPerPageDataSource = useArrayDataSource({
        items: [{ id: 40, page: "40" }, { id: 80, page: "80" }, { id: 120, page: "120" }, { id: 160, page: "160" }],
    }, []);

    const setItemsPerPage = (itemsPerPage: number) => {
        setTableState({ ...tableState, page: 1, pageSize: itemsPerPage });
    };

    useEffect(() => {
        setItemsPerPage(40);
    }, []);

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: mapFilter(rq.filter || {}),
            page: rq.page - 1,
            pageSize: rq.pageSize,
        });
        setTotalCount(() => result.totalCount);
        result.count = result.items.length;
        result.totalCount = result.items.length;
        result.from = 0;
        return result;
    }, [tableState.page, tableState.pageSize]);

    const dataSource = useLazyDataSource<Person, number, Person>({ api }, [api]);

    const view = dataSource.useView(tableState, setTableState, {
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
            <FlexRow cx={ css.presetsPanel } background="gray5" borderBottom={ true }>
                <Text fontSize="24">Profiles Dashboard</Text>
            </FlexRow>
            <FlexRow cx={ css.filterPanelWrapper } background="gray5" borderBottom={ true }>
                <FlexRow cx={ css.filterPanel }>
                    <FiltersToolbar
                        filters={ filters }
                        tableState={ tableState }
                        setTableState={ setTableState }
                    />
                </FlexRow>
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput
                        value={ tableState.search }
                        onValueChange={ (val) => setTableState({ ...tableState, search: val }) }
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
                value={ tableState }
                onValueChange={ setTableState }
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
                            value={ tableState.pageSize }
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
                    onClick={ () => setTableState({ ...tableState, page: +goToPage, indexToScroll: 0 }) }
                    fill="white"
                    color="gray50"
                />
                <Paginator
                    value={ tableState.page }
                    onValueChange={ newPage => setTableState({ ...tableState, page: newPage, indexToScroll: 0 }) }
                    totalPages={ totalPages() }
                    size="24"
                />
            </FlexRow>
        </div>
    );
};