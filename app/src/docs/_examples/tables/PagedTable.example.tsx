import React, { useCallback, useMemo, useState } from 'react';
import { DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApiRequest, useUuiContext } from '@epam/uui-core';
import { DataTable, Panel, Text, Paginator, FlexRow, FlexSpacer } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function PagedTable() {
    const svc = useUuiContext();
    const [state, setState] = useState<DataSourceState>({
        page: 1, pageSize: 5,
    });

    const columns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (person) => (
                    <Text color="primary" font="semibold">
                        {person.name}
                    </Text>
                ),
                isSortable: true,
                grow: 1,
                width: 224,
            }, {
                key: 'location',
                caption: 'Location',
                render: (person) => <Text>{person.locationName}</Text>,
                width: 144,
            },
        ],
        [],
    );

    const api = useCallback(
        async (rq: LazyDataSourceApiRequest<{}>) => {
            const result = await svc.api.demo.personsPaged({
                ...rq,
                filter: { departmentId: 13 }, // to get less results and non round-numbered number of people
                page: rq.page - 1, // TODO: replace this page number modification with out of the box solution
            });
            return result;
        },
        [svc.api.demo],
    );

    const dataSource = useLazyDataSource<Person, number, unknown>({
        api,
        rowOptions: {
            checkbox: {
                isVisible: true,
            },
        },
        backgroundReload: true,
    }, []);

    const view = dataSource.useView(state, setState, {});
    const listProps = view.getListProps();

    return (
        <Panel background="surface" shadow cx={ css.container }>
            <DataTable { ...listProps } getRows={ view.getVisibleRows } value={ state } onValueChange={ setState } columns={ columns } headerTextCase="upper" />
            <FlexRow size="36" padding="12">
                <FlexSpacer />
                <Paginator
                    value={ state.page }
                    onValueChange={ (newPage) => setState({ ...state, page: newPage, scrollTo: { index: 0 } }) }
                    totalPages={ Math.ceil((listProps.totalCount ?? 0) / state.pageSize) }
                    size="30"
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
