import React, { useEffect, useMemo, useState } from 'react';
import { Person } from '@epam/uui-docs';
import { cx, useLazyDataSource, useUuiContext, UuiContexts, ITablePreset, useTableState } from "@epam/uui-core";
import { DataTable } from '@epam/promo';
import css from './FilteredTable.scss';
import type { TApi } from '../../data';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { mapFilter } from "../../demo/table/data";
import { FiltersToolbar } from "./DynamicFilters";


export const FilteredTable: React.FC = () => {
    const svc = useUuiContext<TApi, UuiContexts>();
    const filters = useMemo(getFilters, []);

    const tableStateApi = useTableState({ columns: personColumns });

    const dataSource = useLazyDataSource<Person, number, Person>({
        api: request => {
            const mappedFilter = mapFilter(request.filter || {});
            return svc.api.demo.persons({ ...request, filter: mappedFilter } as any);
        },
    }, []);


    const view = dataSource.useView(tableStateApi.tableState, tableStateApi.setTableState, {
        rowOptions: {
            checkbox: { isVisible: true },
            isSelectable: true,
        },
    });

    return (
            <div className={ css.container }>
                <FiltersToolbar
                    filters={ filters }
                    tableState={ tableStateApi.tableState }
                    setTableState={ tableStateApi.setTableState }
                />

                <DataTable
                    headerTextCase='upper'
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
            </div>
    );
};