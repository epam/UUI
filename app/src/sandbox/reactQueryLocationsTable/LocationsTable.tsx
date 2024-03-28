import React, { useMemo, useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useDataRows, LazyDataSourceApi,
    useFoldingService, useLazyFetchingAdvisor, DataRowOptions, ITreeParams,
    CascadeSelection, Tree as UUITree } from '@epam/uui-core';
import { Text, DataTable, Panel } from '@epam/uui';
import { Location } from '@epam/uui-docs';
import css from './LocationsTable.module.scss';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tree } from './Tree';
import { useCascadeSelection } from './useCascadeSelection';

type LocationsQueryKey = [string, DataSourceState<Record<string, any>, any>];
const LOCATIONS_QUERY = 'locations';

const treeParams: ITreeParams<Location, string> = {
    getId: ({ id }) => id,
    getParentId: ({ parentId }) => parentId,
    getChildCount: ({ childCount }) => childCount,
};

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
    
    const itemsMap = useMemo(() => new Map(), []);
    const blankTree = useMemo(() => Tree.blank(treeParams, itemsMap), []);

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

    const { shouldFetch, shouldReload, shouldLoad, shouldRefetch } = useLazyFetchingAdvisor({
        dataSourceState: tableState,
        backgroundReload: true,
    });

    const { data: tree = blankTree, isFetching } = useQuery<Tree, Error, Tree, LocationsQueryKey>({
        queryKey: [LOCATIONS_QUERY, tableState],
        queryFn: async ({ queryKey: [, dataSourceState] }) => {
            const prevTree = queryClient.getQueryData<Tree>([LOCATIONS_QUERY]) ?? blankTree;
            const { loadedItems, byParentId, nodeInfoById } = await UUITree.load<Location, string>({
                tree: prevTree,
                api,
                getChildCount: (l) => l.childCount,
                isFolded,
                dataSourceState,
            });

            return prevTree.update(loadedItems, byParentId, nodeInfoById);
        },
        placeholderData: shouldReload ? undefined : keepPreviousData,
        enabled: shouldFetch || shouldLoad || shouldRefetch || shouldReload,
    });

    const rowOptions: DataRowOptions<Location, string> = {
        // To make some row `pinned`, it is required to define `pin` function.
        // Parents and elements of the same level can be pinned.
        pin: (location) => location.value.type !== 'city',
        checkbox: { isVisible: true },
    };

    const cascadeSelection: CascadeSelection = 'implicit';
    const cascadeSelectionService = useCascadeSelection({
        api,
        dataSourceState: tableState,
        rowOptions,
        isFolded,
        cascadeSelection,
        itemsMap,
        ...treeParams,
    });

    const { rows, listProps } = useDataRows({
        tree,
        cascadeSelection,
        dataSourceState: tableState,
        setDataSourceState: setTableState,
        rowOptions,
        isFetching: shouldFetch && !shouldLoad && isFetching,
        isLoading: (shouldLoad || shouldReload) && isFetching,
        ...treeParams,
        ...cascadeSelectionService,
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
