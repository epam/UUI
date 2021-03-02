import * as React from 'react';
import { Location } from '@epam/uui-docs';
import { DataSourceState, DataColumnProps, AsyncDataSource } from '@epam/uui';
import { Text, LinkButton, DataTable, DataTableMods, Panel } from '@epam/promo';
import { svc } from '../../../services';
import * as css from './TablesExamples.scss';

export interface LocationsTableProps extends DataTableMods {
}

interface LocationsTableState {
    tableState: DataSourceState;
}

export class TreeTableExample extends React.Component<LocationsTableProps, LocationsTableState> {
    constructor(props: LocationsTableProps, context: any) {
        super(props, context);
    }

    state: LocationsTableState = {
        tableState: {
            sorting: [{ field: 'name', direction: 'asc' }],
        },
    };

    private locationColumns: DataColumnProps<Location>[] = [
        {
            key: 'name',
            caption: 'NAME',
            render: location => <Text size={ this.props.size }>{ location.name }</Text>,
            grow: 1, minWidth: 336,
            isSortable: true,
            fix: 'left',
        },
        {
            key: 'country',
            caption: 'COUNTRY',
            render: location => <Text size={ this.props.size }>{ location.countryName }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 164,
        },
        {
            key: 'type',
            caption: 'TYPE',
            render: location => (location.featureCode && <Text size={ this.props.size }>{ location.featureCode }</Text>),
            isSortable: true,
            grow: 0, shrink: 0, width: 84,
        },
        {
            key: 'lat/long',
            caption: 'LAT/LONG',
            render: location => location.lat && <LinkButton
                caption={ `${ location.lat }/${ location.lon }` }
                color='blue' size={ this.props.size }
                href={ `https://www.google.com/maps/search/?api=1&query=${ location.lat },${ location.lon }` }
                target='_blank'
            />,
            grow: 0, shrink: 0, width: 150,
            textAlign: 'center',
        },
        {
            key: 'population',
            caption: 'POPULATION',
            render: location => <Text size={ this.props.size }>{ location.population }</Text>,
            isSortable: true,
            grow: 0, shrink: 0, width: 130,
            textAlign: 'right',
        },
    ];

    componentWillUnmount(): void {
        this.locationsDS.unsubscribeView(this.handleTableStateChange);
    }

    locationsDS = new AsyncDataSource<Location>({
        api: () => svc.api.demo.locations({}).then(r => r.items),
    });

    handleTableStateChange = (newState: DataSourceState) => this.setState({ tableState: newState });

    render() {
        // handleTableStateChange function should not be re-created on each render, as it would cause performance issues.
        const view = this.locationsDS.getView(this.state.tableState, this.handleTableStateChange, {
            getSearchFields: item => [item.name],
            sortBy: (item, sorting) => {
                switch (sorting.field) {
                    case 'name': return item.name;
                    case 'country': return item.countryName;
                    case 'type': return item.featureCode;
                    case 'population': return item.population;
                }
            },
            getRowOptions: item => ({
                checkbox: { isVisible: true, isDisabled: item.population && +item.population < 20000 },
            }),
            cascadeSelection: true,
        });

        return (
            <Panel shadow cx={ css.container }>
                <DataTable
                    getRows={ view.getVisibleRows }
                    { ...view.getListProps() }
                    value={ this.state.tableState }
                    onValueChange={ (newVal) => this.setState({tableState: newVal}) }
                    columns={ this.locationColumns }
                    size={ this.props.size }
                    headerTextCase='upper'
                    border='none'
                />
            </Panel>
        );
    }
}
