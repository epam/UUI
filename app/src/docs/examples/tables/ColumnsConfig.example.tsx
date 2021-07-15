import React, { useEffect, useMemo, useState } from 'react';
import { Text,  DataTable, Panel, IconButton } from '@epam/promo';
import { DataTableState, DataColumnProps, LazyDataSource } from '@epam/uui';
import { City, svc } from '@epam/uui-docs';
import * as css from "./TablesExamples.scss";
import * as moreIcon from "@epam/assets/icons/common/navigation-more_vert-18.svg";

const LOCAL_STORAGE_KEY = 'dataTable-columnsConfig-example-key';

export default function ColumnsConfigurationDataTableExample(props: unknown) {
    const [tableState, setTableState] = useState<DataTableState>({
        // Get columns config from localStorage
        columnsConfig: svc.uuiUserSettings.get(LOCAL_STORAGE_KEY)
    });

    const citiesColumns: DataColumnProps<City>[] = useMemo(() => [
        {
            key: 'id',
            caption: 'ID',
            render: city => <Text color='gray80' fontSize='14'>{ city.id }</Text>,
            isSortable: true,
            fix: 'left',
            width: 120,
            minWidth: 100,
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
            isSortable: true,
            shrink: 0,
            width: 140,
            minWidth: 100,
        },
        {
            key: 'population',
            caption: 'POPULATION',
            render: city => <Text color='gray80' fontSize='14'>{ city.population }</Text>,
            width: 140,
            minWidth: 100,
            shrink: 0,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'altname',
            caption: 'Alt. names',
            render: (city) => <Text color='gray80'>{ city.alternativeNames.join(', ') }</Text>,
            info: 'Alternative city names',
            shrink: 0,
            width: 300,
            minWidth: 150,
        },
        {
            key: 'actions',
            render: () => <IconButton icon={ moreIcon } color='gray60' />,
            width: 54,
            fix: 'right',
        },
    ], []);

    const citiesDS = new LazyDataSource({ api: svc.api.demo.cities });

    useEffect(() => {
        return () => citiesDS.unsubscribeView(handleTableStateChange);
    }, []);

    const handleTableStateChange = (newState: DataTableState): void => {
        // Set columns config to localStorage
        svc.uuiUserSettings.set(LOCAL_STORAGE_KEY, newState.columnsConfig || {});
        setTableState(newState);
    }

    const view = citiesDS.getView(tableState, handleTableStateChange, {
        getRowOptions: (item: City) => ({ checkbox: { isVisible: true } })
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
            />
        </Panel>
    );
}
