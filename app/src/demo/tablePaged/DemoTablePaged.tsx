import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DemoTablePaged.scss";
import { DataTable, DataTableRow, FlexRow, Paginator, Button, FlexSpacer } from "@epam/promo";
import { DataQueryFilter, DataRowOptions, DataRowProps, DataTableState, LazyDataSourceApi, useLazyDataSource } from "@epam/uui";
import { Person } from "@epam/uui-docs";
import { svc } from "../../services";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from "../table/types";
import { getFilters, mapFilter } from "../table/data";
import { getColumns } from "../table/columns";
import { useTableState } from "../table/hooks";

export const DemoTablePaged: React.FC = () => {
    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(getColumns, []);

    const {tableState, setTableState, setPage} = useTableState({
        columns: columnsSet.personColumns,
    });
    
    const [totalCount, setTotalCount] = useState(0);
    const [appliedFilter, setAppliedFilter] = useState<DataTableState>({});

    const api: LazyDataSourceApi<PersonTableRecord, PersonTableRecordId, PersonTableFilter> = useCallback(async (request, ctx) => {
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
        getId: i => [i.__typename, i.id] as PersonTableRecordId,
        getChildCount: item => item.__typename === "PersonGroup" ? item.count : null,
    }, [api]);
    

    const rowOptions: DataRowOptions<PersonTableRecord, PersonTableRecordId> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
        },
    };

    const renderRow = (props: DataRowProps<PersonTableRecord, PersonTableRecordId>) => {
        const columns = (props.isLoading || props.value?.__typename === "Person") ? props.columns : columnsSet.groupColumns;
        return <DataTableRow key={ props.rowKey } { ...props } size="36" columns={ columns }/>;
    };

    const viewTableState = useMemo(() => ({
        ...tableState,
        filter: appliedFilter,
    }), [tableState, appliedFilter]);
    const personsDataView = dataSource.useView(viewTableState, setTableState, {
        rowOptions,
        isFoldedByDefault: () => true,
        cascadeSelection: true,
    });

    return (
        <div className={ css.container }>
            <DataTable
                headerTextCase="upper"
                getRows={ personsDataView.getVisibleRows }
                columns={ columnsSet.personColumns }
                filters={ filters }
                renderRow={ renderRow }
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