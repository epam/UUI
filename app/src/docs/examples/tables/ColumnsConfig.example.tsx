import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Text,  DataTable, Panel, IconButton, DataTableMods } from '@epam/promo';
import { DataTableState, DataColumnProps, useLazyDataSource, useUuiContext } from '@epam/uui';
import { City } from '@epam/uui-docs';
import * as css from "./TablesExamples.scss";
import * as moreIcon from "@epam/assets/icons/common/navigation-more_vert-18.svg";

const LOCAL_STORAGE_KEY = 'dataTable-columnsConfig-example-key';

export default function ColumnsConfigurationDataTableExample(props: DataTableMods) {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataTableState>({
        // Get columns config from localStorage
        columnsConfig: svc.uuiUserSettings.get(LOCAL_STORAGE_KEY),
    });

    const citiesColumns: DataColumnProps<City>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'ID',
            render: city => <Text color='gray80' fontSize='14'>{ city.id }</Text>,
            isSortable: true,
            fix: 'left',
            width: 120,
            shrink: 0,
        },
        {
            key: 'name',
            caption: 'NAME',
            render: city => <Text color='gray80' fontSize='14'>{ city.name }</Text>,
            isSortable: true,
            shrink: 0,
            width: 200,
            minWidth: 140,
        },
        {
            key: 'countryName',
            caption: 'COUNTRY',
            render: city => <Text color='gray80' fontSize='14'>{ city.countryName }</Text>,
            width: 140,
            minWidth: 100,
            shrink: 0,
            isSortable: true,
        },
        {
            key: 'population',
            caption: 'POPULATION',
            render: city => <Text color='gray80' fontSize='14'>{ city.population }</Text>,
            isSortable: true,
            textAlign: 'right',
            width: 140,
            minWidth: 100,
            shrink: 0,
        },
        {
            key: 'altname',
            caption: 'Alt. names',
            render: city => <Text color='gray80'>{ city.alternativeNames.join(', ') }</Text>,
            info: 'Alternative city names',
            shrink: 0,
            width: 300,
            minWidth: 250,
        },
        {
            key: 'actions',
            render: () => <IconButton icon={ moreIcon } color='gray60' />,
            fix: 'right',
            width: 54
        },
    ], []);

    const citiesDS = useLazyDataSource<City, string, unknown>({
        api: svc.api.demo.cities,
    }, []);

    const handleTableStateChange = useCallback((newState: DataTableState) => {
        // Set columns config to localStorage
        svc.uuiUserSettings.set(LOCAL_STORAGE_KEY, newState.columnsConfig || {});
        setTableState(newState);
    }, []);

    useEffect(() => {
        return () => {
            citiesDS.unsubscribeView(handleTableStateChange);
        };
    }, []);

    const view = citiesDS.useView(tableState, handleTableStateChange, {
        getRowOptions: useCallback(() => ({ checkbox: { isVisible: true } }), []),
    });

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                value={ tableState }
                onValueChange={ handleTableStateChange }
                getRows={ view.getVisibleRows }
                columns={ citiesColumns }
                headerTextCase='upper'
                showColumnsConfig={ true }
                allowColumnsReordering={ true }
                allowColumnsResizing={ true }
                { ...view.getListProps() }
                { ...props }
            />
        </Panel>
    );
};