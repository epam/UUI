import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState, LazyDataSourceApiRequest } from "@epam/uui-core";
import { DataTable, FiltersToolbar, FlexCell, FlexRow, Paginator, Text } from '@epam/promo';
import css from './FilteredTable.scss';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { mapFilter } from "../masterDetailedTable/data";
import { SearchInput } from "@epam/uui";
import { FlexSpacer } from "@epam/uui-components";
import { TApi } from "../../../data";

export const FilteredTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);
    const [totalCount, setTotalCount] = useState(0);
    const { tableState, setTableState } = useTableState({ columns: personColumns });

    useEffect(() => {
        setTableState({ ...tableState, page: 1, pageSize: 100 });
    }, []);

    const api = useCallback(async (rq: LazyDataSourceApiRequest<{}>) => {
        const result = await svc.api.demo.personsPaged({
            ...rq,
            filter: mapFilter(rq.filter || {}),
            page: rq.page - 1,
            pageSize: rq.pageSize,
        });
        setTotalCount(result.totalCount);
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
            <FlexRow size="36" padding="24" vPadding="12" background="gray5">
                <FlexSpacer/>
                <Paginator
                    value={ tableState.page }
                    onValueChange={ newPage => setTableState({ ...tableState, page: newPage, indexToScroll: 0 }) }
                    totalPages={ Math.ceil(totalCount / tableState.pageSize) }
                    size="24"
                />
            </FlexRow>
        </div>
    );
};