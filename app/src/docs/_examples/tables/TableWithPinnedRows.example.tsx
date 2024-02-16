import React, { useMemo, useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useTree, useDataRows, useCascadeSelectionService } from '@epam/uui-core';
import { Text, DataTable, Panel } from '@epam/uui';
import { Location } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function TableWithPinnedRows() {
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

    // const locationsDS = useLazyDataSource<Location, string, unknown>({
    //     api: (request, ctx) => {
    //         const filter = { parentId: ctx?.parentId };
    //         return svc.api.demo.locations({ ...request, filter });
    //     },
    //     getParentId: ({ parentId }) => parentId,
    //     getChildCount: (l) => l.childCount,
    //     backgroundReload: true,
    // }, []);

    // useEffect(() => {
    //     return () => locationsDS.unsubscribeView(setTableState);
    // }, [locationsDS]);

    // const view = locationsDS.useView(tableState, setTableState, {
    //     rowOptions: {
    //         // To make some row `pinned`, it is required to define `pin` function.
    //         // Parents and elements of the same level can be pinned.
    //         pin: (location) => location.value.type !== 'city',
    //     }, 
    // });

    const { tree, selectionTree, loadMissingRecordsOnCheck, ...restProps } = useTree<Location, string, unknown>({
        type: 'lazy',
        api: (request, ctx) => {
            const filter = { parentId: ctx?.parentId };
            return svc.api.demo.locations({ ...request, filter });
        },
        getId: ({ id }) => id,
        getParentId: ({ parentId }) => parentId,
        getChildCount: (l) => l.childCount,
        backgroundReload: true,
        cascadeSelection: 'explicit',
        dataSourceState: tableState,
        setDataSourceState: setTableState,
        rowOptions: {
            checkbox: { isVisible: true },
            // To make some row `pinned`, it is required to define `pin` function.
            // Parents and elements of the same level can be pinned.
            pin: (location) => location.value.type !== 'city',
        },
    }, []);

    const cascadeSelectionService = useCascadeSelectionService({
        tree: selectionTree,
        cascadeSelection: restProps.cascadeSelection,
        getRowOptions: restProps.getRowOptions,
        rowOptions: restProps.rowOptions,
        getItemStatus: restProps.getItemStatus,
        loadMissingRecordsOnCheck,
    });

    const { rows, listProps } = useDataRows({ tree, ...restProps, ...cascadeSelectionService });

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
