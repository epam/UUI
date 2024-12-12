import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useLazyDataSource, DropdownBodyProps } from '@epam/uui-core';
import {
    Dropdown,
    DropdownMenuButton,
    DropdownMenuSplitter,
    DropdownMenuBody,
    Text,
    DataTable,
    Panel,
    IconButton,
    DataTableCell, TextInput,
} from '@epam/uui';
import { City } from '@epam/uui-docs';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as PencilIcon } from '@epam/assets/icons/common/content-edit-18.svg';

import css from './TablesExamples.module.scss';

export default function CitiesTable() {
    const svc = useUuiContext();
    const [tableState, setTableState] = useState<DataSourceState>({});

    const renderMenu = (dropdownProps: DropdownBodyProps): ReactNode => (
        <DropdownMenuBody minWidth={ 90 } { ...dropdownProps }>
            <DropdownMenuButton caption="Edit" icon={ PencilIcon } iconPosition="right" />
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
                caption: 'Id',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.id}
                    </Text>
                ),
                isSortable: true,
                fix: 'left',
                width: 120,
            }, {
                key: 'name',
                caption: 'Name',
                renderCell: (props) => (
                    <DataTableCell
                        { ...props.rowLens.prop('name').toProps() }
                        renderEditor={ (props) => <TextInput { ...props } /> }
                        { ...props }
                    />
                ),
                canCopy: () => true,
                isSortable: true,
                width: 162,
                grow: 1,
            }, {
                key: 'countryName',
                caption: 'Country',
                renderCell: (props) => (
                    <DataTableCell
                        { ...props.rowLens.prop('countryName').toProps() }
                        renderEditor={ (props) => <TextInput { ...props } /> }
                        { ...props }
                    />
                ),
                canAcceptCopy: () => true,
                isSortable: true,
                width: 128,
                isFilterActive: (filter) => filter.country && filter.country.$in && !!filter.country.$in.length,
            }, {
                key: 'population',
                caption: 'Population',
                info: 'Number of this population in the country at the time of the last census.',
                render: (city) => (
                    <Text color="primary" fontSize="14">
                        {city.population}
                    </Text>
                ),
                width: 136,
                isSortable: true,
                textAlign: 'right',
            }, {
                key: 'altname',
                caption: 'Alt. names',
                render: (city) => <Text color="primary">{city.alternativeNames.join(', ')}</Text>,
                info: 'Alternative city names',
                width: 1200,
            }, {
                key: 'actions',
                render: () => (
                    <Dropdown
                        renderTarget={ (props) => <IconButton icon={ MoreIcon } color="secondary" cx={ [css.configItem, props.isOpen && css.showButton] } { ...props } /> }
                        renderBody={ (dropdownProps) => renderMenu(dropdownProps) }
                        placement="bottom-end"
                    />
                ),
                width: 54,
                fix: 'right',
            },
        ],
        [],
    );

    // Create DataSource instance for your table.
    // For more details go to the DataSources example
    const citiesDS = useLazyDataSource<City, string, unknown>({
        api: svc.api.demo.cities,
        backgroundReload: true,
    }, []);

    // IMPORTANT! Unsubscribe view from DataSource when you don't need it more.
    // Pass this.handleTableStateChange function which you provided to getView as a second argument
    useEffect(() => {
        return () => citiesDS.unsubscribeView(setTableState);
    }, []);

    // Create View according to your tableState and options
    const view = citiesDS.useView(tableState, setTableState, {
        getRowOptions: useCallback(
            (item) => ({
                checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
            }),
            [],
        ),
        cascadeSelection: true,
    });

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                value={ tableState }
                onValueChange={ setTableState }
                // Spread ListProps and provide getVisibleRows function from view to DataTable component.
                // getRows function will be called every time when table will need more rows.
                { ...view.getListProps() }
                onCopy={ () => {} }
                getRows={ view.getVisibleRows }
                showColumnsConfig={ false }
                headerTextCase="upper"
                columns={ citiesColumns }
            />
        </Panel>
    );
}
