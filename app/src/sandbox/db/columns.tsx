import * as React from 'react';
import { Text, TextInput, TextArea } from '@epam/loveship';
import { DemoDbRef } from './state';
import { IEditable, DataQueryFilter, DataColumnProps } from '@epam/uui-core';
import { Person, PersonEmploymentGroup } from '@epam/uui-docs';
import dayjs from 'dayjs';

export function getColumns(dbRef: DemoDbRef) {
    function fieldLens<TField extends keyof Person>(fieldName: TField, person: Person): IEditable<Person[TField]> {
        if (person == null) {
            return {
                value: null,
                onValueChange: () => {},
            };
        }
        return {
            value: person[fieldName],
            onValueChange: (newValue: Person[TField]) => dbRef.commit({ persons: [{ id: person.id, [fieldName]: newValue }] }),
        };
    }

    const personColumns: DataColumnProps<Person, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: 'Name',
            render: (p) => <TextInput mode="cell" { ...fieldLens('name', p) } />,
            width: 250,
            fix: 'left',
            isSortable: true,
        }, {
            key: 'jobTitle',
            caption: 'Job Title',
            render: (r) => <Text>{r.jobTitle}</Text>,
            width: 200,
            isSortable: true,
            isFilterActive: (f) => !!f.jobTitle,
        }, {
            key: 'departmentName',
            caption: 'Department',
            render: (r) => <Text>{r.departmentName}</Text>,
            width: 200,
            isSortable: true,
            isFilterActive: (f) => !!f.departmentId,
        }, {
            key: 'birthDate',
            caption: 'Birth Date',
            render: (r) => <Text>{ dayjs(r?.birthDate).format('MMM D, YYYY')}</Text>,
            width: 120,
            isSortable: true,
        }, {
            key: 'hireDate',
            caption: 'Hire Date',
            render: (r) => <Text>{dayjs(r?.hireDate).format('MMM D, YYYY')}</Text>,
            width: 120,
            isSortable: true,
        }, {
            key: 'notes',
            caption: 'Notes',
            render: (p) => <TextArea mode="cell" rows={ 1 } autoSize { ...fieldLens('notes', p) } />,
            width: 200,
            grow: 1,
        },
    ];

    const groupColumns: DataColumnProps<PersonEmploymentGroup, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: 'Name',
            render: (p) => <Text>{p.name}</Text>,
            fix: 'left',
            width: 250,
        }, {
            key: 'spacer',
            caption: 'Name',
            render: () => null,
            width: 0,
            grow: 1,
        },
    ];

    return {
        personColumns,
        groupColumns,
    };
}
