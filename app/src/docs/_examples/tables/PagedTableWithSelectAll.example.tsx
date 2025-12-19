import React, { useCallback, useMemo, useState } from 'react';
import { DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApiRequest, useUuiContext, LazyDataSourceApi, ICheckable, useAbortController } from '@epam/uui-core';
import { DataTable, Panel, Text, Paginator, FlexRow, FlexSpacer } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function PagedTableWithSelectAll() {
    const svc = useUuiContext();
    const [state, setState] = useState<DataSourceState>({
        page: 1, pageSize: 10,
    });

    const columns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (person) => (
                    <Text color="primary" fontWeight="600">
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

    const api: LazyDataSourceApi<Person, number, unknown> = useCallback(
        async (rq: LazyDataSourceApiRequest<{}>) => {
            const result = await svc.api.demo.personsPaged({
                ...rq,
                filter: { departmentId: 13 }, // to get less results and non round-numbered number of people
            });
            return result;
        },
        [svc.api.demo],
    );

    const { getAbortSignal } = useAbortController();
    
    const selectAll = useCallback(async (shouldSelectAll: boolean) => {
        if (!shouldSelectAll) {
            setState((current) => ({ ...current, checked: [] }));
            return;
        }
        const { page, pageSize, ...stateWithoutPaging } = state;
        const allRecords = await api(stateWithoutPaging, { signal: getAbortSignal() });

        setState((current) => ({ ...current, checked: allRecords.items.map((item) => item.id) }));
    }, [api, getAbortSignal, state]);

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

    const selectAllCheckable: ICheckable = useMemo(() => ({
        indeterminate: state.checked?.length > 0 && state.checked?.length !== listProps.totalCount,
        value: state.checked?.length > 0 && state.checked?.length === listProps.totalCount,
        onValueChange: selectAll,
    }), [selectAll, state.checked?.length, listProps.totalCount]);

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                { ...listProps }
                getRows={ view.getVisibleRows }
                value={ state }
                onValueChange={ setState }
                columns={ columns }
                headerTextCase="upper"
                selectAll={ selectAllCheckable }
            />
            <FlexRow size="36" padding="12">
                <FlexSpacer />
                <Paginator
                    value={ state.page }
                    onValueChange={ (newPage) => setState({ ...state, page: newPage, scrollTo: { index: 0 } }) }
                    totalPages={ Math.ceil((listProps.totalCount ?? 0) / state.pageSize) }
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
