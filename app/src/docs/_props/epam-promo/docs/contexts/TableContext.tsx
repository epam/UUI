import React from 'react';
import { DemoComponentProps, demoData } from '@epam/uui-docs';
import { ArrayDataSource, DataColumnProps, Metadata } from '@epam/uui-core';
import { Panel, DataTable, DataTableCell, useForm, FlexRow, Button, FlexSpacer, FlexCell, Text } from '@epam/promo';

interface Person {
    id: number;
    name: string;
    yearsInCompany: number;
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

export const TableContext = (contextProps: DemoComponentProps) => {
    const { DemoComponent } = contextProps;

    const { lens, save, isChanged, revert, undo, canUndo, redo, canRedo } = useForm<FormState>({
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
            key: 'name',
            caption: 'Name',
            renderCell: (props) => (
                <DataTableCell
                    {...props.rowLens.prop(DemoComponent.name === 'PickerInput' ? 'id' : 'name').toProps()}
                    renderEditor={(props) => <DemoComponent valueType="id" selectionMode="single" dataSource={dataSource} getName={(i: any) => i.name} {...props} />}
                    {...props}
                />
            ),
            isSortable: true,
            width: 300,
            fix: 'left',
        },
        {
            key: 'yearsInCompany',
            caption: 'Years In Company',
            renderCell: (props) => (
                <DataTableCell
                    {...props.rowLens.prop(DemoComponent.name === 'PickerInput' ? 'id' : 'yearsInCompany').toProps()}
                    renderEditor={(props) => (
                        <DemoComponent valueType="id" selectionMode="single" dataSource={dataSource} getName={(i: any) => i.yearsInCompany} {...props} />
                    )}
                    {...props}
                />
            ),
            isSortable: true,
            width: 120,
        },
        {
            key: 'departmentName',
            caption: 'Department Name',
            render: (props) => <Text>{props.departmentName}</Text>,
            isSortable: true,
            width: 200,
        },
        {
            key: 'birthDate',
            caption: 'Birth Date',
            renderCell: (props) => (
                <DataTableCell
                    {...props.rowLens.prop(DemoComponent.name === 'PickerInput' ? 'id' : 'birthDate').toProps()}
                    renderEditor={(props) => <DemoComponent valueType="id" selectionMode="single" dataSource={dataSource} getName={(i: any) => i.birthDate} {...props} />}
                    {...props}
                />
            ),
            isSortable: true,
            width: 180,
        },
    ];

    return (
        <>
            <Panel style={{ width: '100%', paddingLeft: '3px' }}>
                <DataTable
                    headerTextCase="upper"
                    getRows={dataView.getVisibleRows}
                    columns={personColumns}
                    value={tableState}
                    onValueChange={setTableState}
                    showColumnsConfig
                    allowColumnsResizing
                    allowColumnsReordering
                    {...dataView.getListProps()}
                />
            </Panel>
            <FlexRow spacing="12" margin="12">
                <FlexSpacer />
                <FlexCell width="auto">
                    <Button color="green" caption="Save" onClick={save} />
                </FlexCell>
            </FlexRow>
        </>
    );
};

TableContext.displayName = 'Table';
