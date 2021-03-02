import * as React from 'react';
import { Text, TextInput, TextArea } from '@epam/loveship';
import { DemoDbRef } from './state';
import { IEditable, DataQueryFilter, DataColumnProps } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

export function getColumns(dbRef: DemoDbRef) {
    function fieldLens<TField extends keyof Person>(fieldName: TField, person: Person): IEditable<Person[TField]> {
        if (person == null) {
            return {
                value: null,
                onValueChange: () => {},
            }
        }
        return {
            value: person[fieldName],
            onValueChange: (newValue: Person[TField]) => dbRef.commit({ persons: [{ id: person.id, [fieldName]: newValue }]}),
        };
    }

    const personColumns: DataColumnProps<Person, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <TextInput mode='cell' { ...fieldLens('name', p) } />,
            width: 250,
            minWidth: 80,
            shrink: 0,
            fix: 'left',
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: "Job Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 200,
            minWidth: 100,
            shrink: 0,
            isSortable: true,
            isFilterActive: f => !!f.jobTitle,
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: r => <Text>{ r.departmentName }</Text>,
            width: 200,
            minWidth: 120,
            shrink: 0,
            isSortable: true,
            isFilterActive: f => !!f.departmentId,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            render: r => <Text>{ r?.birthDate?.toLocaleDateString() }</Text>,
            width: 120,
            minWidth: 100,
            shrink: 0,
            isSortable: true,
        },
        {
            key: 'hireDate',
            caption: "Hire Date",
            render: r => <Text>{ r?.hireDate?.toLocaleDateString() }</Text>,
            width: 120,
            minWidth: 100,
            shrink: 0,
            isSortable: true,
        },
        {
            key: 'notes',
            caption: "Notes",
            render: p => <TextArea mode='cell' rows={ 1 } autoSize { ...fieldLens('notes', p) } />,
            minWidth: 100,
            shrink: 0,
        },
    ];

    const groupColumns: DataColumnProps<PersonGroup, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            grow: 1,
        },
    ];

    return {
        personColumns,
        groupColumns,
    };
}