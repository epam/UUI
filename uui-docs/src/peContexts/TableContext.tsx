import React from 'react';
import { demoData } from '../demoData';
import { DemoComponentProps } from '../types';
import { ArrayDataSource, DataColumnProps, Metadata } from '@epam/uui-core';
import { Panel, DataTable, DataTableCell, useForm, FlexRow, Button, FlexSpacer, FlexCell, NumericInput, TextInput } from '@epam/uui';

interface Person {
    id: number;
    [prop: string]: any;
}

interface FormState {
    items: Record<number, Person>;
}

const metadata: Metadata<FormState> = {
    props: {
        items: {
            all: {
                props: {
                    name: { isRequired: true },
                    yearsInCompany: { isRequired: true },
                    departmentName: { isRequired: true },
                    birthDate: { isRequired: true },
                },
            },
        },
    },
};

let savedValue: FormState = { items: {} };

export function TableContext(contextProps: DemoComponentProps) {
    const { DemoComponent } = contextProps;

    const {
        lens, save,
    } = useForm<FormState>({
        value: savedValue,
        onSave: async (value) => {
            savedValue = value;
        },
        getMetadata: () => metadata,
    });

    const [tableState, setTableState] = React.useState({});

    const dataSource = new ArrayDataSource<Person, number, unknown>({
        items: demoData.personDemoData,
        getId: (p) => p.id,
    });

    const dataView = dataSource.useView(tableState, setTableState, {
        getRowOptions: (person) => ({
            ...lens.prop('items').prop(person.id).toProps(),
            checkbox: { isVisible: true },
        }),
    });

    const personColumns: DataColumnProps<Person>[] = [
        {
            key: 'Component-1',
            caption: 'Component',
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('demoField').toProps() }
                    renderEditor={ (props) => <DemoComponent { ...props } { ...contextProps.props } /> }
                    { ...props }
                />
            ),
            isSortable: true,
            width: 300,
            fix: 'left',
        }, {
            key: 'yearsInCompany',
            caption: 'Years In Company',
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('yearsInCompany').toProps() }
                    renderEditor={ (props) => <NumericInput { ...props } /> }
                    { ...props }
                />
            ),
            isSortable: true,
            width: 120,
        }, {
            key: 'departmentName',
            caption: 'Department Name',
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('departmentName').toProps() }
                    renderEditor={ (props) => <TextInput { ...props } /> }
                    { ...props }
                />
            ),
            isSortable: true,
            width: 200,
        }, {
            key: 'Component-2',
            caption: 'Component',
            renderCell: (props) => (
                <DataTableCell
                    { ...props.rowLens.prop('demoField2').toProps() }
                    renderEditor={ (props) => <DemoComponent { ...props } { ...contextProps.props } /> }
                    { ...props }
                />
            ),
            isSortable: true,
            width: 180,
        },
    ];

    return (
        <>
            <Panel style={ { width: '100%', paddingLeft: '3px' } }>
                <DataTable
                    headerTextCase="upper"
                    getRows={ dataView.getVisibleRows }
                    columns={ personColumns }
                    value={ tableState }
                    onValueChange={ setTableState }
                    showColumnsConfig
                    allowColumnsResizing
                    allowColumnsReordering
                    { ...dataView.getListProps() }
                />
            </Panel>
            <FlexRow columnGap="12" margin="12">
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button color="primary" caption="Save" onClick={ save } />
                </FlexCell>
            </FlexRow>
        </>
    );
}

TableContext.displayName = 'Table';
