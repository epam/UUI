import React, { useMemo } from 'react';
import { Person } from '@epam/uui-docs';
import { useLazyDataSource, useUuiContext, UuiContexts, useTableState } from "@epam/uui-core";
import { DataTable, FiltersToolbar, FlexRow } from '@epam/promo';
import css from './FilteredTable.scss';
import type { TApi } from '../../../data';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { mapFilter } from "../masterDetailedTable/data";
import { FlexCell } from "@epam/uui-components";
import { SearchInput } from "@epam/uui";

export const FilteredTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);
    const tableStateApi = useTableState({ columns: personColumns });
    const tableState = tableStateApi.tableState;

    const dataSource = useLazyDataSource<Person, number, Person>({
        api: request => {
            const mappedFilter = mapFilter(request.filter || {});
            return svc.api.demo.persons({ ...request, filter: mappedFilter } as any);
        },
    }, []);


    const view = dataSource.useView(tableState, tableStateApi.setTableState, {
        rowOptions: {
            checkbox: { isVisible: true },
            isSelectable: true,
        },
    });

    return (
        <div className={ css.container }>
            <FlexRow cx={ css.filterPanelWrapper } background="gray5" borderBottom={ true }>
                <FlexRow cx={ css.filterPanel }>
                    <FiltersToolbar
                        filters={ filters }
                        tableState={ tableState }
                        setTableState={ tableStateApi.setTableState }
                    />
                </FlexRow>
                <FlexCell cx={ css.search } width={ 295 }>
                    <SearchInput
                        value={ tableState.search }
                        onValueChange={ (val) => tableStateApi.setTableState({ ...tableState, search: val }) }
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
                onValueChange={ tableStateApi.setTableState }
                showColumnsConfig={ true }
                allowColumnsResizing
                allowColumnsReordering
                { ...view.getListProps() }
            />
        </div>
    );
};