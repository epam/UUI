import React, { useEffect, useMemo, useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useTree, useDataRows, LazyDataSourceApi,
    FetchingHelper, useFoldingService, useLazyFetchingAdvisor } from '@epam/uui-core';
import { Text, DataTable, Panel } from '@epam/uui';
import { Location } from '@epam/uui-docs';
import css from './LocationsTable.module.scss';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tree } from './Tree';

const blankTree = Tree.blank({
    getId: ({ id }) => id,
    getParentId: ({ parentId }) => parentId,
});

export function LocationsTable() {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState>({
        topIndex: 0,
        visibleCount: 20,
    });
    const locationsColumns: DataColumnProps<Location>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (location) => (
                    <Text color="primary" fontSize="14">
                        {location.name}
                    </Text>
                ),
                isSortable: true,
                width: 300,
                minWidth: 165,
                grow: 1,
            },
            {
                key: 'countryName',
                caption: 'Country',
                render: (location) => (
                    <Text color="primary" fontSize="14">
                        {location.countryName ?? ''}
                    </Text>
                ),
                isSortable: true,
                width: 300,
                isFilterActive: (filter) => filter.country && filter.country.$in && !!filter.country.$in.length,
            },
            {
                key: 'population',
                caption: 'Population',
                info: 'Number of this population in the country at the time of the last census.',
                render: (location) => (
                    <Text color="primary" fontSize="14">
                        {location.population}
                    </Text>
                ),
                width: 136,
                isSortable: true,
                textAlign: 'right',
            },
        ],
        [],
    );
    
    const api: LazyDataSourceApi<Location, string, unknown> = (request, ctx) => {
        const filter = { parentId: ctx?.parentId };
        return svc.api.demo.locations({ ...request, filter });
    };
    
    const { isFolded } = useFoldingService<Location, string>({
        getId: ({ id }) => id,
        dataSourceState: tableState, 
        setDataSourceState: setTableState, 
    });

    const queryClient = useQueryClient();
    
    const { shouldFetch, shouldLoad, shouldRefetch } = useLazyFetchingAdvisor({
        dataSourceState: tableState,
        backgroundReload: true,
        rowsCount: blankTree.getTotalCount(),
    });

    useEffect(
        () => {
            if (shouldFetch || shouldLoad || shouldRefetch) {
                queryClient.invalidateQueries({ queryKey: ['locations'] });
            }
        },
        [queryClient, shouldFetch, shouldLoad, shouldRefetch],
    );

    const { status, data: tree = blankTree, error } = useQuery<Tree, Error, Tree, [string, DataSourceState<Record<string, any>, any>, (item: Location) => boolean]>({
        queryKey: ['locations', tableState, isFolded], // unique key that identifies the state of the entire tree
        queryFn: async ({ queryKey: [, _tableState] }) => {
            const prevTree = queryClient.getQueryData<Tree>(['locations']) ?? blankTree;

            const { loadedItems, byParentId, nodeInfoById } = await FetchingHelper.load<Location, string, unknown>({
                tree: prevTree,
                options: {
                    api,
                    getChildCount: (l) => l.childCount,
                    isFolded,
                    filter: _tableState?.filter,
                },
                dataSourceState: _tableState,
                withNestedChildren: true,
            });
            return prevTree.update(loadedItems, byParentId, nodeInfoById);
        },
        placeholderData: shouldRefetch ? undefined : keepPreviousData,
        enabled: shouldFetch || shouldLoad || shouldRefetch,
    });

    // const { tree, ...restProps } = useTree<Location, string, unknown>({
    //     type: 'lazy',
    //     api: (request, ctx) => {
    //         const filter = { parentId: ctx?.parentId };
    //         return svc.api.demo.locations({ ...request, filter });
    //     },
    //     getId: ({ id }) => id,
    //     getParentId: ({ parentId }) => parentId,
    //     getChildCount: (l) => l.childCount,
    //     backgroundReload: true,
    //     cascadeSelection: 'implicit',
    //     dataSourceState: tableState,
    //     setDataSourceState: setTableState,
    //     rowOptions: {
    //         checkbox: { isVisible: true },
    //         // To make some row `pinned`, it is required to define `pin` function.
    //         // Parents and elements of the same level can be pinned.
    //         pin: (location) => location.value.type !== 'city',
    //     },
    // }, []);

    const { rows, listProps } = useDataRows({
        tree,
        getId: ({ id }) => id,
        getParentId: ({ parentId }) => parentId,
        getChildCount: (l) => l.childCount,
        cascadeSelection: 'implicit',
        dataSourceState: tableState,
        setDataSourceState: setTableState,
        rowOptions: {
            checkbox: { isVisible: true },
            // To make some row `pinned`, it is required to define `pin` function.
            // Parents and elements of the same level can be pinned.
            pin: (location) => location.value.type !== 'city',
        },
    });

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                value={ tableState }
                onValueChange={ setTableState }
                { ...listProps }
                rows={ rows }
                headerTextCase="upper"
                columns={ locationsColumns }
            />
        </Panel>
    );
}
