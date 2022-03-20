import React, { useCallback, useMemo, useState } from "react";
import css from "./DemoTablePaged.scss";
import { DataTable, FlexRow, Paginator, Button, FlexSpacer } from "@epam/promo";
import { DataQueryFilter, DataRowOptions, DataTableState, LazyDataSourceApi, useLazyDataSource, useTableState } from "@epam/uui-core";
import { Person } from "@epam/uui-docs";
import { svc } from "../../services";
import { PersonTableFilter, PersonTableRecord } from "./types";
import { getFilters, mapFilter } from "./data";
import { personColumns } from "./columns";

export const DemoTablePaged: React.FC = () => {
    const filters = useMemo(getFilters, []);

    const {tableState, setTableState, setPage} = useTableState({
        columns: personColumns,
    });

    const [totalCount, setTotalCount] = useState(0);
    const [appliedFilter, setAppliedFilter] = useState<DataTableState>({});

    const api: LazyDataSourceApi<PersonTableRecord, number, PersonTableFilter> = useCallback(async (request, ctx) => {
        const result = await svc.api.demo.personsPaged({
            filter: mapFilter(request.filter) as DataQueryFilter<Person>,
            page: request.page - 1,
            pageSize: request.pageSize,
        });
        setTotalCount(result.totalCount);
        result.count = result.items.length;
        result.totalCount = result.items.length;
        result.from = 0;
        return result;
    }, []);

    const applyFilter = useCallback(() => {
        setAppliedFilter(tableState.filter);
    }, [tableState.filter]);

    const dataSource = useLazyDataSource({
        api,
        getId: i => i.id,
    }, [api]);

    const rowOptions: DataRowOptions<PersonTableRecord, number> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
        },
    };

    const viewTableState = useMemo(() => ({
        ...tableState,
        filter: appliedFilter,
    }), [tableState, appliedFilter]);

    const personsDataView = dataSource.useView(viewTableState, setTableState, { rowOptions });

    return (
        <div className={ css.container }>
            <DataTable
                headerTextCase="upper"
                getRows={ personsDataView.getVisibleRows }
                columns={ personColumns }
                filters={ filters }
                showColumnsConfig
                value={ tableState }
                onValueChange={ setTableState }
                allowColumnsResizing
                { ...personsDataView.getListProps() }
            />

            <FlexRow size="36" padding="12" background="gray5">
                <FlexSpacer/>
                <Paginator
                    value={ tableState.page }
                    onValueChange={ setPage }
                    totalPages={ Math.ceil(totalCount / tableState.pageSize) }
                    size="30"
                />
                <FlexSpacer/>
            </FlexRow>

            <Button caption="Apply filter" onClick={ applyFilter }/>
        </div>
    );
};