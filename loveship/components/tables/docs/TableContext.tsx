import React from 'react';
import { DataSourceState, Lens, ScrollManager, DataColumnProps, uuiContextTypes, UuiContexts, ColumnsConfig } from '@epam/uui';
import { DemoComponentProps, demoData } from '@epam/uui-docs';
import { Text, DataTableRow, DataTableHeaderRow, Panel, DataTableScrollRow, FlexRow, FlexSpacer, IconButton } from '../..';
import { ColumnsConfigurationModal } from '../ColumnsConfigurationModal';
import * as gearIcon from '../../icons/action-settings-18.svg';

export type Person = {
    id: number,
    name: string,
    phoneNumber: string,
    gender: string,
    avatarUrl?: string,
    personType?: string,
    jobTitle?: string,
    birthDate?: string,
    hireDate?: string,
    departmentId?: number,
    departmentName?: string,
};

type DataTableCardState = {
    tableState: DataSourceState,
    items: Person[],
    columnsConfig: ColumnsConfig;
};

let tableData = demoData.personDemoData;

export class TableContext extends React.Component<DemoComponentProps, any> {
    state: DataTableCardState = {
        tableState: {

        },
        items: tableData,
        columnsConfig: {},
    };

    lens = Lens.onState<DataTableCardState>(this);
    scrollManager = new ScrollManager();
    static contextTypes = uuiContextTypes;
    context: UuiContexts;

    public static displayName = "Table";

    getVisibleColumns() {
        return this.props.props.columns.filter((i: DataColumnProps<any>) => this.state.columnsConfig[i.key] ? this.state.columnsConfig[i.key].isVisible : true);
    }

    getRows() {
        let sort = this.state.tableState.sorting;
        let rows = this.state.items;
        let columns: DataColumnProps<any>[] = this.getVisibleColumns();
        if (sort) {
            columns.forEach(item => {
                let fieldToSort = sort[0] && sort[0].field;

                if (item.key === fieldToSort) {
                    if (item.key === 'id' || item.key === 'departmentId') {
                        rows = rows.sort((a: any, b: any) => a[item.key] - b[item.key]);
                    } else {
                        rows = rows.sort((a: any, b: any) => a[fieldToSort].localeCompare(b[fieldToSort]));
                    }

                    if (sort[0].direction === 'desc') {
                        rows = rows.reverse();
                    }
                }
            });
        }

        return rows.map((item, index) => <DataTableRow
            key={ index }
            size={ this.props.props.size }
            borderBottom={ this.props.props.borderBottom }
            columns={ columns }
            value={ item }
            id={ index }
            rowKey={ index + '' }
            index={ index }
            scrollManager={ this.scrollManager }
        />);
    }

    showConfigurationModal = () => {
        this.context.uuiModals
            .show<ColumnsConfig>(modalProps => (
                <ColumnsConfigurationModal
                    { ...modalProps }
                    columns={ this.props.props.columns }
                    columnsConfig={ this.state.columnsConfig }
                    defaultConfig={ {gender: {
                        isVisible: false,
                        order: 'f',
                    }} }
                />
            ))
            .then(columnConfiguration => {
                this.setState({columnsConfig: columnConfiguration});
            });
    }

    getTable(component: any, props: any) {
        if (component === DataTableRow) {
            return <>
                <FlexRow size="48" background="white" padding="24">
                        <Text>items</Text>
                    <FlexSpacer />
                    <IconButton
                        icon={ gearIcon }
                        onClick={ this.showConfigurationModal }
                    />
                </FlexRow>
                <DataTableHeaderRow
                    key='header'
                    columns={ this.getVisibleColumns() }
                    scrollManager={ this.scrollManager }
                    size={ props.size }
                    { ...this.lens.prop('tableState').toProps() }
                />
                { React.createElement(component as any, { ...props, scrollManager: this.scrollManager, columns: this.getVisibleColumns() }) }
                { this.getRows() }
                { React.createElement(component as any, { ...props, scrollManager: this.scrollManager, columns: this.getVisibleColumns() }) }
            </>;
        }
        if (component === DataTableHeaderRow) {
            return <>
                { React.createElement(component as any, { ...props, scrollManager: this.scrollManager, columns: this.getVisibleColumns() }) }
                { this.getRows() }
            </>;
        }
    }

    render() {
        const { DemoComponent, props } = this.props;
        const columns = this.props.props.columns;
        return (
            <Panel margin='24' shadow style={ { 'width': '50%' } }>
                { this.getTable(DemoComponent, props) }
                <DataTableScrollRow key='scroll' scrollManager={ this.scrollManager } columns={ columns } size={ props.size }/>
            </Panel>
        );
    }
}