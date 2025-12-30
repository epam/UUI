import React, { useMemo, useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useLazyDataSource } from '@epam/uui-core';
import { Text, DataTable, Panel } from '@epam/uui';
import { Location } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';

export default function TableWithPinnedRows() {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState>({});
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

    const dataSource = useLazyDataSource<Location, string, unknown>({
        api: (request, ctx) => {
            const filter = { parentId: ctx?.parentId };
            return svc.api.demo.locations({ ...request, filter }, ctx);
        },
        getParentId: ({ parentId }) => parentId,
        getChildCount: (l) => l.childCount,
        backgroundReload: true,
    }, []);

    const view = dataSource.useView(tableState, setTableState, {
        rowOptions: {
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
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                headerTextCase="upper"
                columns={ locationsColumns }
            />
        </Panel>
    );
}
