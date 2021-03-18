import * as React from 'react';
import { Text,  DataTable, Panel, IconButton } from '@epam/promo';
import { DataTableState, DataColumnProps, LazyDataSource } from '@epam/uui';
import { City } from '@epam/uui-docs';
import { svc } from '../../../services';
import * as css from "./TablesExamples.scss";
import * as moreIcon from "@epam/assets/icons/common/navigation-more_vert-18.svg";


interface CitiesTableState {
    tableState: DataTableState;
}

const LOCAL_STORAGE_KEY = 'dataTable-columnsConfig-example-key';

export class ColumnsConfigurationDataTableExample extends React.Component<any, CitiesTableState> {
    state: CitiesTableState = {
        tableState: {
            // Get columns config from localStorage
            columnsConfig: svc.uuiUserSettings.get(LOCAL_STORAGE_KEY),
        },
    };

    citiesColumns: DataColumnProps<City>[] = [
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
    ];

    componentWillUnmount(): void {
        this.citiesDS.unsubscribeView(this.handleTableStateChange);
    }

    citiesDS = new LazyDataSource({
        api: svc.api.demo.cities,
    });

    handleTableStateChange = (newState: DataTableState) => {
        // Set columns config to localStorage
        svc.uuiUserSettings.set(LOCAL_STORAGE_KEY, newState.columnsConfig || {});

        this.setState({ tableState: newState });
    }

    render() {
        const view = this.citiesDS.getView(this.state.tableState, this.handleTableStateChange, {
            getRowOptions: (item: City) => ({
                checkbox: { isVisible: true },
            }),
        });
        return (
            <Panel shadow cx={ css.container }>
                <DataTable
                    value={ this.state.tableState }
                    onValueChange={ this.handleTableStateChange }
                    getRows={ view.getVisibleRows }
                    columns={ this.citiesColumns }
                    headerTextCase='upper'

                    showColumnsConfig={ true }
                    allowColumnsReordering={ true }
                    allowColumnsResizing={ true }

                    { ...view.getListProps() }
                    { ...this.props }
                />
            </Panel>
        );
    }
}
