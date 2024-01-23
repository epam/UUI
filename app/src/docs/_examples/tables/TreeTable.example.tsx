import React, { useState, useMemo } from 'react';
import { Location } from '@epam/uui-docs';
import { DataSourceState, DataColumnProps, useUuiContext, LazyDataSourceApiResponse, useTree, useDataRows } from '@epam/uui-core';
import { Text, LinkButton, DataTable, Panel } from '@epam/uui';
import css from './TablesExamples.module.scss';

export default function TreeTableExample() {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState<Location, string>>({
        sorting: [{ field: 'name', direction: 'asc' }],
    });

    const locationColumns: DataColumnProps<Location>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (location) => <Text>{location.name}</Text>,
                grow: 1,
                width: 336,
                isSortable: true,
                fix: 'left',
            },
            {
                key: 'country',
                caption: 'Country',
                render: (location) => <Text>{location.countryName}</Text>,
                isSortable: true,
                width: 164,
            },
            {
                key: 'type',
                caption: 'Type',
                render: (location) => location.featureCode && <Text>{location.featureCode}</Text>,
                isSortable: true,
                width: 84,
            },
            {
                key: 'lat/long',
                caption: 'LAT/LONG',
                render: (location) =>
                    location.lat && (
                        <LinkButton
                            caption={ `${location.lat}/${location.lon}` }
                            href={ `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}` }
                            target="_blank"
                        />
                    ),
                width: 150,
                textAlign: 'center',
            },
            {
                key: 'population',
                caption: 'Population',
                render: (location) => <Text>{location.population}</Text>,
                isSortable: true,
                width: 130,
                textAlign: 'right',
            },
        ],
        [],
    );

    // const locationsDS = useAsyncDataSource<Location, string, Location>(
    //     {
    //         api: () => svc.api.demo.locations({}).then((r: LazyDataSourceApiResponse<Location>) => r.items),
    //     },
    //     [],
    // );

    // useEffect(() => {
    //     return () => {
    //         locationsDS.unsubscribeView(setTableState);
    //     };
    // }, []);

    // // handleTableStateChange function should not be re-created on each render, as it would cause performance issues.
    // const view = locationsDS.useView(tableState, setTableState, {
    //     getSearchFields: (item) => [item.name],
    //     sortBy: (item, sorting) => {
    //         switch (sorting.field) {
    //             case 'name':
    //                 return item.name;
    //             case 'country':
    //                 return item.countryName;
    //             case 'type':
    //                 return item.featureCode;
    //             case 'population':
    //                 return item.population;
    //         }
    //     },
    //     cascadeSelection: true,
    //     getRowOptions: (item) => ({
    //         checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
    //     }),
    // });

    const { tree, ...restProps } = useTree<Location, string, Location>({ 
        type: 'async',
        api: () => svc.api.demo.locations({}).then((r: LazyDataSourceApiResponse<Location>) => r.items),
        getId: (item) => item.id,
        getParentId: (item) => item.parentId,
        getChildCount: (item) => item.childCount,
        dataSourceState: tableState,
        setDataSourceState: setTableState,
        getSearchFields: (item) => [item.name],
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
        getRowOptions: (item) => ({
            checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
        }),
    }, []);

    const { rows, listProps } = useDataRows({ tree, ...restProps });

    return (
        <Panel background="surface-main" shadow cx={ css.container } rawProps={ { role: 'tree_grid' } }>
            <DataTable
                rows={ rows }
                { ...listProps }
                value={ tableState }
                onValueChange={ (newVal) => setTableState(newVal) }
                columns={ locationColumns }
                headerTextCase="upper"
                border={ false }
            />
        </Panel>
    );
}
