import * as React from 'react';
import {
    DataSourceState,
    Lens,
    DataColumnProps,
    UuiContexts,
    ColumnsConfig,
    UuiContext,
} from '@epam/uui-core';
import { DemoComponentProps, demoData } from '@epam/uui-docs';
import { Text, DataTableRow, DataTableHeaderRow, Panel, FlexRow, FlexSpacer, IconButton } from '@epam/loveship';
import { ColumnsConfigurationModal } from '@epam/uui';
import { ReactComponent as GearIcon } from '@epam/assets/icons/common/action-settings-18.svg';

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

export class TableContext extends React.Component<DemoComponentProps, DataTableCardState> {
    state: DataTableCardState = {
        tableState: {},
        items: demoData.personDemoData,
        columnsConfig: {},
    };

    lens = Lens.onState<DataTableCardState>(this);
    static contextType = UuiContext;
    context: UuiContexts;

    public static displayName = "Table";

    getVisibleColumns() {
        return this.props.props.columns.filter((i: DataColumnProps<DemoComponentProps>) => this.state.columnsConfig[i.key]?.isVisible || true);
    }

    getRows() {
        const sort = this.state.tableState.sorting;
        const rows = this.state.items;
        const columns: DataColumnProps<DemoComponentProps>[] = this.getVisibleColumns();

        if (sort) {
            columns.forEach(({ key }) => {
                const fieldKey = sort?.[0].field as keyof Person;
                if (fieldKey !== key) return;
                if (sort[0].direction === 'desc') rows.reverse();
                rows.sort((a, b) =>
                    (key === 'id' || key === 'departmentId') ?
                    a[key] - b[key] :
                    a[key].localeCompare(b[key]),
                );
            });
        }

        return rows.map((item, index) => (
            <DataTableRow
                key={ index }
                size={ this.props.props.size }
                borderBottom={ this.props.props.borderBottom }
                columns={ columns }
                value={ item }
                id={ index }
                rowKey={ index + '' }
                index={ index }
            />
        ));
    }

    showConfigurationModal = () => {
        this.context.uuiModals.show<ColumnsConfig>(modalProps => (
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ this.props.props.columns }
                columnsConfig={ this.state.columnsConfig }
                defaultConfig={ {
                    gender: {
                        isVisible: false,
                        order: 'f',
                    },
                } }
            />
        )).then(columnsConfig => this.setState({ columnsConfig }));
    }

    getTable(Component: DemoComponentProps['DemoComponent'], props: DemoComponentProps['props']) {
        if (Component === DataTableRow) {
            return <>
                <FlexRow size="48" background="white" padding="24">
                    <Text>items</Text>
                    <FlexSpacer />
                    <IconButton icon={ GearIcon } onClick={ this.showConfigurationModal } />
                </FlexRow>
                <DataTableHeaderRow
                    columns={ this.getVisibleColumns() }
                    size={ props.size }
                    { ...this.lens.prop('tableState').toProps() }
                />
                <Component { ...props } columns={ this.getVisibleColumns() } />
                { this.getRows() }
                <Component { ...props } columns={ this.getVisibleColumns() } />
            </>;
        } else if (Component === DataTableHeaderRow) {
            return <>
                <Component { ...props } columns={ this.getVisibleColumns() } />
                { this.getRows() }
            </>;
        }
    }

    render() {
        return (
            <Panel margin='24' shadow style={ { 'width': '50%' } }>
                { this.getTable(this.props.DemoComponent, this.props.props) }
            </Panel>
        );
    }
}
