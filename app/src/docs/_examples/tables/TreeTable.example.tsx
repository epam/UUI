import React, { useState, useEffect, useMemo } from 'react';
import { Location } from '@epam/uui-docs';
import { DataSourceState, DataColumnProps, useUuiContext, useAsyncDataSource, LazyDataSourceApiResponse } from '@epam/uui';
import { Text, LinkButton, DataTable, DataTableMods, Panel } from '@epam/promo';
import css from './TablesExamples.scss';

export default function TreeTableExample({ size }: DataTableMods) {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState<Location, string>>({
        sorting: [{ field: 'name', direction: 'asc' }],
    });

    const locationColumns: DataColumnProps<Location>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'NAME',
                render: location => <Text size={size}>{location.name}</Text>,
                grow: 1,
                width: 336,
                isSortable: true,
                fix: 'left',
            },
            {
                key: 'country',
                caption: 'COUNTRY',
                render: location => <Text size={size}>{location.countryName}</Text>,
                isSortable: true,
                width: 164,
            },
            {
                key: 'type',
                caption: 'TYPE',
                render: location => location.featureCode && <Text size={size}>{location.featureCode}</Text>,
                isSortable: true,
                width: 84,
            },
            {
                key: 'lat/long',
                caption: 'LAT/LONG',
                render: location =>
                    location.lat && (
                        <LinkButton
                            caption={`${location.lat}/${location.lon}`}
                            color="blue"
                            size={size}
                            href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`}
                            target="_blank"
                        />
                    ),
                width: 150,
                textAlign: 'center',
            },
            {
                key: 'population',
                caption: 'POPULATION',
                render: location => <Text size={size}>{location.population}</Text>,
                isSortable: true,
                width: 130,
                textAlign: 'right',
            },
        ],
        []
    );

    const locationsDS = useAsyncDataSource<Location, string, unknown>(
        {
            api: () => svc.api.demo.locations({}).then((r: LazyDataSourceApiResponse<Location>) => r.items),
        },
        []
    );

    useEffect(() => {
        return () => {
            locationsDS.unsubscribeView(setTableState);
        };
    }, []);

    // handleTableStateChange function should not be re-created on each render, as it would cause performance issues.
    const view = locationsDS.useView(tableState, setTableState, {
        getSearchFields: item => [item.name],
        sortBy: (item, sorting) => {
            switch (sorting.field) {
                case 'name':
                    return item.name;
                case 'country':
                    return item.countryName;
                case 'type':
                    return item.featureCode;
                case 'population':
                    return item.population;
            }
        },
        cascadeSelection: true,
        getRowOptions: item => ({
            checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
        }),
    });

    return (
        <Panel shadow cx={css.container} rawProps={{ role: 'treegrid' }}>
            <DataTable
                getRows={view.getVisibleRows}
                {...view.getListProps()}
                value={tableState}
                onValueChange={newVal => setTableState(newVal)}
                columns={locationColumns}
                size={size}
                headerTextCase="upper"
                border="none"
            />
        </Panel>
    );
}
