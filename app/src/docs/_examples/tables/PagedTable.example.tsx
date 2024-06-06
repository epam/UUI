import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { DataColumnProps, useLazyDataSource, DataSourceState, LazyDataSourceApiRequest, useUuiContext, LazyDataSourceApi } from '@epam/uui-core';
import { DataTable, Panel, Text, Paginator, FlexRow, FlexSpacer } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function PagedTable() {
    const svc = useUuiContext();
    const [state, setState] = useState<DataSourceState>({
        page: 1, pageSize: 10,
    });

    const setTableState = useCallback((newState: SetStateAction<DataSourceState>) => {
        setState((currentState) => {
            const updatedState = typeof newState === 'function' ? newState(currentState) : newState;
            const isFilterChanged = !isEqual(currentState.filter, updatedState.filter);
            const isSearchChanged = currentState.search !== updatedState.search;
            const isSortingChanged = !isEqual(currentState.sorting, updatedState.sorting);
            const isPagingChanged = currentState.page !== updatedState.page || currentState.pageSize !== updatedState.pageSize;
    
            if (isFilterChanged || isSearchChanged || isSortingChanged || isPagingChanged) {
                return { ...updatedState, checked: [] };
            }
            return updatedState;
        });
    }, []);

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

    const dataSource = useLazyDataSource<Person, number, unknown>({
        api,
        rowOptions: {
            checkbox: {
                isVisible: true,
            },
        },
        backgroundReload: true,
    }, []);

    const view = dataSource.useView(state, setTableState, {});
    const listProps = view.getListProps();

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                { ...listProps }
                getRows={ view.getVisibleRows }
                value={ state }
                onValueChange={ setTableState }
                columns={ columns }
                headerTextCase="upper"
            />
            <FlexRow size="36" padding="12">
                <FlexSpacer />
                <Paginator
                    value={ state.page }
                    onValueChange={ (newPage) => setTableState({ ...state, page: newPage, scrollTo: { index: 0 } }) }
                    totalPages={ Math.ceil((listProps.totalCount ?? 0) / state.pageSize) }
                    size="30"
                />
                <FlexSpacer />
            </FlexRow>
        </Panel>
    );
}
