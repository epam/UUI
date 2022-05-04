import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DemoTablePaged.scss";
import { DataTable, FlexRow, Paginator, Button, FlexSpacer } from "@epam/promo";
import { DataQueryFilter, DataRowOptions, DataTableState, FiltersConfig, LazyDataSourceApi, useArrayDataSource, useLazyDataSource, useTableState } from "@epam/uui-core";
import { Person } from "@epam/uui-docs";
import { svc } from "../../services";
import { PersonTableFilter, PersonTableRecord, PersonTableRecordId } from "./types";
import { getFilters, mapFilter } from "./data";
import { getColumns } from "./columns";
import { DynamicFilters } from "./DynamicFilters";

export const DemoTablePaged: React.FC = () => {
    const filters = useMemo(getFilters, []);
    const columnsSet = useMemo(getColumns, []);

    const {tableState, setTableState} = useTableState({
        columns: columnsSet,
    });
    
    useEffect(() => {
        setTableState({...tableState, page: 1, pageSize: 100});
    }, []);
    
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
        setTableState({ ...tableState, indexToScroll: 0 });
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
            <DynamicFilters
                filters={ filters }
                tableState={ tableState }
                setTableState={ setTableState }
            />
            
            <DataTable
                headerTextCase="upper"
                getRows={ personsDataView.getVisibleRows }
                columns={ columnsSet }
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
                    onValueChange={ (page: number) => setTableState({...tableState, page, indexToScroll: 0 }) }
                    totalPages={ Math.ceil(totalCount / tableState.pageSize) }
                    size="30"
                />
                <FlexSpacer/>
            </FlexRow>

            <FlexRow vPadding="12" background="white">
                <Button caption="Apply filter" onClick={ applyFilter } cx={ css.apply }/>
            </FlexRow>
        </div>
    );
};