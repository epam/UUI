import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import css from './DemoTablePaged.scss';
import {
    DataTable, FlexRow, Paginator, FlexSpacer, Button,
} from '@epam/promo';
import {
    DataRowOptions, LazyDataSourceApi, useTableState, useList,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { svc } from '../../services';
import { getFilters } from './filters';
import { personColumns } from './columns';
import { FlexCell } from '@epam/uui-components';

export const DemoTablePaged: React.FC = () => {
    const filters = useMemo(getFilters, []);

    const { tableState, setTableState } = useTableState<Person>({
        columns: personColumns,
    });

    useEffect(() => {
        setTableState({ ...tableState, page: 1, pageSize: 100 });
    }, []);

    const [totalCount, setTotalCount] = useState(0);
    const [appliedFilter, setAppliedFilter] = useState<Person>();

    const api: LazyDataSourceApi<Person, number, Person> = useCallback(async (request) => {
        const result = await svc.api.demo.personsPaged({
            filter: request.filter,
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
    }, [tableState]);

    // applying filter after parsing initial filter data from url
    useEffect(() => {
        applyFilter();
    }, []);

    const rowOptions: DataRowOptions<Person, number> = {
        checkbox: { isVisible: true },
        isSelectable: true,
        onClick(rowProps) {
            rowProps.onSelect(rowProps);
        },
    };

    const viewTableState = useMemo(
        () => ({
            ...tableState,
            filter: appliedFilter,
        }),
        [tableState, appliedFilter],
    );

    const { rows, listProps } = useList(
        {
            type: 'lazy',
            listState: tableState,
            setListState: setTableState,
            api,
            rowOptions,
            getId: ({ id }) => id,
            isFoldedByDefault: () => true,
        },
        [api],
    );

    return (
        <div className={ css.container }>
            <DataTable
                headerTextCase="upper"
                getRows={ () => rows }
                columns={ personColumns }
                filters={ filters }
                showColumnsConfig
                value={ tableState }
                onValueChange={ setTableState }
                allowColumnsResizing
                { ...listProps }
            />

            <FlexRow size="36" padding="12" background="gray5">
                <FlexCell width="auto">
                    <Button caption="Apply filter" onClick={ applyFilter } cx={ css.apply } />
                </FlexCell>
                <FlexSpacer />
                <Paginator
                    value={ tableState.page }
                    onValueChange={ (page: number) => setTableState({ ...tableState, page, indexToScroll: 0 }) }
                    totalPages={ Math.ceil(totalCount / tableState.pageSize) }
                    size="30"
                />
                <FlexSpacer />
            </FlexRow>
        </div>
    );
};
