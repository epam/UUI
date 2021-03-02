import * as React from 'react';
import { Text, DataTableMods, DataTable, ColumnPickerFilter, Panel, IconButton } from '@epam/promo';
import { DataSourceState, DataColumnProps, LazyDataSource, ILens } from '@epam/uui';
import {DropdownMenuBody, DropdownMenuButton, DropdownMenuSplitter} from "@epam/loveship";
import { City, Country } from '@epam/uui-docs';
import { svc } from '../../../services';
import * as css from "./TablesExamples.scss";
import { Dropdown } from "@epam/uui-components";
import * as moreIcon from "@epam/assets/icons/common/navigation-more_vert-18.svg";
import * as pencilIcon from "@epam/assets/icons/common/content-edit-18.svg";

export interface CitiesTableProps extends DataTableMods {
}

interface CitiesTableState {
    tableState: DataSourceState;
}

export class CitiesTable extends React.Component<CitiesTableProps, CitiesTableState> {
    state: CitiesTableState = {
        tableState: {},
    };

    // If you need some filters for your table, you need to create Picker which will change 'filter' field in DataSourceState object. And than pass it to the column renderFilter option.
    // Look to the Pickers examples for more details about Picker configuration.
    countriesDS = new LazyDataSource<Country, string, any>({
        api: (req) => svc.api.demo.countries(req),
    });

    handleRenderCountryPickerFilter = (filerLens: ILens<any>) => {
        return (
            <ColumnPickerFilter<Country, string>
                dataSource={ this.countriesDS }
                getName={ (val) => val.name }
                selectionMode='multi'
                valueType='id'
                emptyValue={ null }
                { ...filerLens.prop('country').prop('$in').toProps() }
            />
        );
    }

    renderMenu() {
        return (
            <DropdownMenuBody color='white'>
                <DropdownMenuButton caption='Edit' icon={pencilIcon}/>
                <DropdownMenuButton caption='Remove'/>
                <DropdownMenuSplitter/>
                <DropdownMenuButton caption='Cancel'/>
            </DropdownMenuBody>
        );
    }


    // Define columns config array
    private citiesColumns: DataColumnProps<City>[] = [
        {
            key: 'id',
            caption: 'ID',
            render: city => <Text color='gray80' fontSize='14'>{ city.id }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 124, fix: 'left',
        },
        {
            key: 'name',
            caption: 'NAME',
            render: city => <Text color='gray80' fontSize='14'>{ city.name }</Text>,
            isSortable: true,
            grow: 2, shrink: 0, width: 162,
        },
        {
            key: 'countryName',
            caption: 'COUNTRY',
            render: city => <Text color='gray80' fontSize='14'>{ city.countryName }</Text>,
            isSortable: true,
            grow: 1, shrink: 0, width: 128,
            renderFilter: this.handleRenderCountryPickerFilter,
            isFilterActive: filter => filter.country && filter.country.$in && !!filter.country.$in.length,
        },
        {
            key: 'population',
            caption: 'POPULATION',
            render: city => <Text color='gray80' fontSize='14'>{ city.population }</Text>,
            grow: 0, shrink: 0, width: 136,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'altname',
            caption: 'Alt. names',
            render: (city) => <Text color='gray80'>{ city.alternativeNames.join(', ') }</Text>,
            info: 'Alternative city names',
            grow: 1, shrink: 0, width: 1200,
        },
        {
            key: 'actions',
            render: (value) => <Dropdown
                renderTarget={ props => <IconButton icon={ moreIcon } color='gray60' { ...props } /> }
                renderBody={ this.renderMenu }
                placement='bottom-end'
            />,
            grow: 0, shrink: 0, width: 54,
            fix: 'right',
        },
    ];

    // IMPORTANT! Unsubscribe view from DataSource when you don't need it more.
    // Pass this.handleTableStateChange function which you provided to getView as a second argument
    componentWillUnmount(): void {
        this.citiesDS.unsubscribeView(this.handleTableStateChange);
    }

    // Create DataSource instance for your table.
    // For more details go to the DataSources example
    citiesDS = new LazyDataSource({
        api: svc.api.demo.cities,
    });

    // handleTableStateChange function should not be re-created on each render, as it would cause performance issues.
    handleTableStateChange = (newState: DataSourceState) => this.setState({ tableState: newState });

    render() {
        // Create View according to your tableState and options
        const view = this.citiesDS.getView(this.state.tableState, this.handleTableStateChange, {
            getRowOptions: (item: City) => ({
                checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
            }),
        });
        return (
            <Panel shadow cx={ css.container }>
                <DataTable
                    value={ this.state.tableState }
                    onValueChange={ (newVal) => this.setState({tableState: newVal}) }
                    // Spread ListProps and provide getVisibleRows function from view to DataTable component.
                    // getRows function will be called every time when table will need more rows.
                    { ...view.getListProps() }
                    getRows={ view.getVisibleRows }
                    showColumnsConfig={ true }
                    headerTextCase='upper'
                    columns={ this.citiesColumns }
                    { ...this.props }
                />
            </Panel>
        );
    }
}
