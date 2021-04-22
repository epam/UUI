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

export class TableContext extends React.Component<DemoComponentProps, any> {
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
                render: item => <DemoComponent { ...props } mode='cell' >{ item.id }</DemoComponent>,
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
                render: item => <DemoComponent  { ...props }  mode='cell' >{ item.id }</DemoComponent>,
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
                render: item => <DemoComponent { ...props } mode='cell' >{ item.id }</DemoComponent>,
                renderCell: propsCell => <DataTableCell padding='0' { ...propsCell } />,
                isSortable: true,
                isAlwaysVisible: true,
                grow: 0, shrink: 0, width: 170,
            },
        ];

        return (
            <>
                <FlexRow padding='24' vPadding='24'>
                    <RichTextView>
                        <code>Don't be confused: In the context of this demo, the prop 'mode' is switched to cell mode and cannot be edited</code>
                    </RichTextView>
                </FlexRow>
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