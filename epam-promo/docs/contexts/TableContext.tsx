import * as React from 'react';
import { DemoComponentProps, demoData } from '@epam/uui-docs';
import { ArrayDataSource, DataColumnProps, DataSourceState } from '@epam/uui';
import { Panel, Text, DataTable, DataTableCell, FlexRow, RichTextView } from '../../components';

interface Person {
    id: number;
    name: string;
    personType: string;
    avatarUrl: string;
    phoneNumber: string;
    jobTitle: string;
    birthDate: string;
    gender: string;
    hireDate: string;
    departmentId: number;
    departmentName: string;
}

interface DemoComponentState {
    demoState: DataSourceState
};

export class TableContext extends React.Component<DemoComponentProps, DemoComponentState> {
    public static displayName = 'Table';

    state = {
        demoState: {},
    };

    dataSource = new ArrayDataSource<Person, number, any>({
        items: demoData.personDemoData,
        getId: p => p.id,
    });

    handleDemoStateChange = (newState: DataSourceState) => this.setState({ demoState: newState });

    render() {
        const { DemoComponent, props } = this.props;
        const view = this.dataSource.getView(this.state.demoState, this.handleDemoStateChange, {
            getRowOptions: (item: Person) => ({
                checkbox: { isVisible: true },
            }),
        });

        const personColumns: DataColumnProps<Person>[] = [
            {
                key: 'demo_first',
                caption: 'Demo',
                render: item => <DemoComponent { ...props }>{ item.id }</DemoComponent>,
                renderCell: propsCell => <DataTableCell padding='12' isFirstColumn={ true } { ...propsCell } />,
                isSortable: true,
                isAlwaysVisible: true,
                grow: 0, shrink: 0, width: 200,
            },
            {
                key: 'name',
                caption: 'Name',
                render: item => <Text size={ props.size } color='gray80'>{ item.name }</Text>,
                isSortable: true,
                grow: 0, minWidth: 170,
            },
            {
                key: 'demo_second',
                caption: 'Demo',
                render: item => <DemoComponent  { ...props }>{ item.id }</DemoComponent>,
                renderCell: propsCell => <DataTableCell padding='0' { ...propsCell } />,
                isSortable: true,
                isAlwaysVisible: true,
                grow: 0, shrink: 0, width: 170,
            },
            {
                key: 'phoneNumber',
                caption: 'Phone Number',
                render: item => <Text size={ props.size } color='gray80'>{ item.phoneNumber }</Text>,
                grow: 1, shrink: 0, width: 150,
            },
            {
                key: 'demo_third',
                caption: 'Demo',
                render: item => <DemoComponent { ...props }>{ item.id }</DemoComponent>,
                renderCell: propsCell => <DataTableCell padding='0' { ...propsCell } />,
                isSortable: true,
                isAlwaysVisible: true,
                grow: 0, shrink: 0, width: 170,
            },
        ];

        return (
            <>
                <Panel margin='24' >
                    <DataTable
                        { ...view.getListProps() }
                        getRows={ view.getVisibleRows }
                        value={ this.state.demoState }
                        onValueChange={ this.handleDemoStateChange }
                        columns={ personColumns }
                        headerTextCase='upper'
                        size={ props.size }
                    />
                </Panel>
            </>
        );
    }
}