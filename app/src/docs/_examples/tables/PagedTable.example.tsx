import React, { useCallback, useMemo, useState } from 'react';
import { DataTable, Panel, Text, Paginator, FlexRow } from '@epam/promo';
import { DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApiRequest, useUuiContext } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.scss';
import { FlexSpacer } from '@epam/uui-components';

export interface PagedTableState extends DataSourceState<{}> {
    page?: number;
    pageSize?: number;
    totalCount?: number;
}

export default function PagedTable() {
    const svc = useUuiContext();
    const [state, setState] = useState<PagedTableState>({ page: 1, visibleCount: 15, totalCount: 0, pageSize: 100 });

    const columns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'NAME',
                render: person => (
                    <Text color="gray80" font="sans-semibold">
                        {person.name}
                    </Text>
                ),
                isSortable: true,
                grow: 1,
                width: 224,
            },
            {
                key: 'location',
                caption: 'LOCATION',
                render: person => <Text>{person.locationName}</Text>,
                width: 144,
            },
        ],
        []
    );

    const api = useCallback(
        async (rq: LazyDataSourceApiRequest<{}>) => {
            const result = await svc.api.demo.personsPaged({
                ...rq,
                filter: { departmentId: 13 }, // to get less results and non round-numbered number of people
                page: state.page - 1, // server counts from 0, UI - from 1
                pageSize: state.pageSize,
            });
            setState(s => ({ ...s, totalCount: result.totalCount }));
            result.count = result.items.length;
            result.from = 0;
            return result;
        },
        [state.page, state.pageSize]
    );

    const dataSource = useLazyDataSource<Person, number, unknown>({ api }, [state.page]);
    const view = dataSource.useView(state, setState, {});

    return (
        <Panel shadow cx={css.container}>
            <DataTable
                {...view.getListProps()}
                getRows={view.getVisibleRows}
                value={state}
                onValueChange={setState}
                columns={columns}
                headerTextCase="upper"
            />
            <FlexRow size="36" padding="12" background="gray5">
                <FlexSpacer />
                <Paginator
                    value={state.page}
                    onValueChange={newPage => setState({ ...state, page: newPage, indexToScroll: 0 })}
                    totalPages={Math.ceil(state.totalCount / state.pageSize)}
                    size="30"
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
