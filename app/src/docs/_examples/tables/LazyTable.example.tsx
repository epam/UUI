import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, DataTable, Panel, IconButton } from '@epam/promo';
import { DataSourceState, DataColumnProps, useUuiContext, useLazyDataSource } from '@epam/uui';
import { DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter } from '@epam/loveship';
import { City } from '@epam/uui-docs';
import { Dropdown } from '@epam/uui-components';
import css from './TablesExamples.scss';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as PencilIcon } from '@epam/assets/icons/common/content-edit-18.svg';

export default function CitiesTable(props: unknown) {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState>({});

    const renderMenu = (): ReactNode => (
        <DropdownMenuBody color="white">
            <DropdownMenuButton caption="Edit" icon={PencilIcon} />
            <DropdownMenuButton caption="Remove" />
            <DropdownMenuSplitter />
            <DropdownMenuButton caption="Cancel" />
        </DropdownMenuBody>
    );

    // Define columns config array
    const citiesColumns: DataColumnProps<City>[] = useMemo(
        () => [
            {
                key: 'id',
                caption: 'ID',
                render: city => (
                    <Text color="gray80" fontSize="14">
                        {city.id}
                    </Text>
                ),
                isSortable: true,
                fix: 'left',
                width: 120,
            },
            {
                key: 'name',
                caption: 'NAME',
                render: city => (
                    <Text color="gray80" fontSize="14">
                        {city.name}
                    </Text>
                ),
                isSortable: true,
                width: 162,
                grow: 1,
            },
            {
                key: 'countryName',
                caption: 'COUNTRY',
                render: city => (
                    <Text color="gray80" fontSize="14">
                        {city.countryName}
                    </Text>
                ),
                isSortable: true,
                width: 128,
                isFilterActive: filter => filter.country && filter.country.$in && !!filter.country.$in.length,
            },
            {
                key: 'population',
                caption: 'POPULATION',
                render: city => (
                    <Text color="gray80" fontSize="14">
                        {city.population}
                    </Text>
                ),
                width: 136,
                isSortable: true,
                textAlign: 'right',
            },
            {
                key: 'altname',
                caption: 'Alt. names',
                render: city => <Text color="gray80">{city.alternativeNames.join(', ')}</Text>,
                info: 'Alternative city names',
                width: 1200,
            },
            {
                key: 'actions',
                render: () => (
                    <Dropdown
                        renderTarget={props => (
                            <IconButton icon={MoreIcon} color="gray60" cx={[css.configItem, props.isOpen && css.showButton]} {...props} />
                        )}
                        renderBody={renderMenu}
                        placement="bottom-end"
                    />
                ),
                width: 54,
                fix: 'right',
            },
        ],
        []
    );

    // Create DataSource instance for your table.
    // For more details go to the DataSources example
    const citiesDS = useLazyDataSource<City, string, unknown>({ api: svc.api.demo.cities }, []);

    // IMPORTANT! Unsubscribe view from DataSource when you don't need it more.
    // Pass this.handleTableStateChange function which you provided to getView as a second argument
    useEffect(() => {
        return () => citiesDS.unsubscribeView(setTableState);
    }, []);

    // Create View according to your tableState and options
    const view = citiesDS.useView(tableState, setTableState, {
        getRowOptions: useCallback(
            item => ({
                checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
            }),
            []
        ),
        cascadeSelection: true,
    });

    return (
        <Panel shadow cx={css.container}>
            <DataTable
                value={tableState}
                onValueChange={setTableState}
                // Spread ListProps and provide getVisibleRows function from view to DataTable component.
                // getRows function will be called every time when table will need more rows.
                {...view.getListProps()}
                getRows={view.getVisibleRows}
                headerTextCase="upper"
                columns={citiesColumns}
                {...(props as object)}
            />
        </Panel>
    );
}
