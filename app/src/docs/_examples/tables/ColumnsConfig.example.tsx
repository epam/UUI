import React, { useCallback, useState, useMemo, SetStateAction } from 'react';
import { DataTableState, DataColumnProps, useLazyDataSource, useUuiContext } from '@epam/uui-core';
import { Text, DataTable, Panel, IconButton } from '@epam/uui';
import { City } from '@epam/uui-docs';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

import css from './TablesExamples.module.scss';

const LOCAL_STORAGE_KEY = 'dataTable-columnsConfig-example-key';

export default function ColumnsConfigurationDataTableExample() {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataTableState>({
        // Get columns config from localStorage
        columnsConfig: svc.uuiUserSettings.get(LOCAL_STORAGE_KEY),
    });

    const citiesColumns: DataColumnProps<City>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'Id',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.id}
                    </Text>
                ),
                isSortable: true,
                allowResizing: true,
                width: 120,
            },
            {
                key: 'name',
                caption: 'Name',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.name}
                    </Text>
                ),
                isSortable: true,
                allowResizing: true,
                width: 200,
            },
            {
                key: 'countryName',
                caption: 'Country',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.countryName}
                    </Text>
                ),
                isSortable: true,
                width: 140,
            },
            {
                key: 'population',
                caption: 'Population',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.population}
                    </Text>
                ),
                width: 140,
                isSortable: true,
                allowResizing: true,
                textAlign: 'right',
            },
            {
                key: 'altname',
                caption: 'Alt. names',
                render: (city) => <Text color="primary">{city.alternativeNames.join(', ')}</Text>,
                info: 'Alternative city names',
                width: 300,
            },
            {
                key: 'actions',
                render: () => <IconButton icon={ MoreIcon } color="secondary" />,
                width: 54,
                fix: 'right',
                allowResizing: false,
            },
        ],
        [],
    );

    const citiesDS = useLazyDataSource<City, string, unknown>(
        {
            api: svc.api.demo.cities,
            backgroundReload: true,
        },
        [],
    );

    const handleTableStateChange = useCallback((newState: SetStateAction<DataTableState>) => {
        const updatedState = typeof newState === 'function' ? newState(tableState) : newState;
        // Set columns config to localStorage
        svc.uuiUserSettings.set(LOCAL_STORAGE_KEY, updatedState.columnsConfig || {});
        setTableState(updatedState);
    }, [svc.uuiUserSettings, tableState]);

    const view = citiesDS.useView(tableState, handleTableStateChange, {
        getRowOptions: useCallback(() => ({ checkbox: { isVisible: true } }), []),
    });

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                value={ tableState }
                onValueChange={ handleTableStateChange }
                getRows={ view.getVisibleRows }
                columns={ citiesColumns }
                headerTextCase="upper"
                showColumnsConfig={ true }
                allowColumnsReordering={ true }
                // allowColumnsResizing={ true }
                { ...view.getListProps() }
            />
        </Panel>
    );
}
