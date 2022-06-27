import * as React from 'react';
import { Text, TextInput, TextArea, DataTableCell } from '@epam/loveship';
import { DataQueryFilter, DataColumnProps } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

export const personColumns: DataColumnProps<Person, number, DataQueryFilter<Person>>[] = [
    {
        key: 'name',
        caption: "Name",
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('name').toProps() }
            renderEditor={ props => <TextInput { ...props } /> }
            { ...props }
        />,
        width: 250,
        fix: 'left',
        isSortable: true,
    },
    {
        key: 'jobTitle',
        caption: "Job Title",
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('jobTitle').toProps() }
            renderEditor={ props => <TextInput { ...props } /> }
            { ...props }
        />,
        width: 200,
        isSortable: true,
        isFilterActive: f => !!f.jobTitle,
    },
    {
        key: 'departmentName',
        caption: "Department",
        render: r => <Text>{ r.departmentName }</Text>,
        width: 200,
        isSortable: true,
        isFilterActive: f => !!f.departmentId,
    },
    {
        key: 'birthDate',
        caption: "Birth Date",
        render: r => <Text>{ r?.birthDate?.toLocaleDateString() }</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'hireDate',
        caption: "Hire Date",
        render: r => <Text>{ r?.hireDate?.toLocaleDateString() }</Text>,
        width: 120,
        isSortable: true,
    },
    {
        key: 'notes',
        caption: "Notes",
        renderCell: (props) => <DataTableCell
            { ...props.rowLens.prop('notes').toProps() }
            renderEditor={ props => (
                <TextArea { ...props } autoSize={ true } />
            ) }
            { ...props }
        />,
        width: 200,
        grow: 1,
    },
];

export const groupColumns: DataColumnProps<PersonGroup, number, DataQueryFilter<Person>>[] = [
    {
        key: 'name',
        caption: "Name",
        render: p => <Text>{ p.name }</Text>,
        fix: 'left',
        width: 250,
    },
];