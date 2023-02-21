import * as React from 'react';
import { Text, FlexRow } from '@epam/loveship';
import { DataQueryFilter, DataColumnProps } from '@epam/uui-core';
import type { Person } from '@epam/uui-docs';
import type { PersonTableRecordId } from './types';
import type { PersonsSummary } from './PersonsTableDemo';

export function getColumns() {
    const personColumns: DataColumnProps<Person, PersonTableRecordId, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 250,
            grow: 1,
            fix: 'left',
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: "Job Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 200,
            grow: 1,
            isSortable: true,
            isFilterActive: f => !!f.jobTitle,
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: p => <Text>{ p.departmentName }</Text>,
            width: 200,
            grow: 1,
            isSortable: true,
            isFilterActive: f => !!f.departmentId,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            render: p => p?.birthDate && <Text>{ new Date(p.birthDate).toLocaleDateString() }</Text>,
            width: 120,
            isSortable: true,
        },
        {
            key: 'hireDate',
            caption: "Hire Date",
            render: p => p?.hireDate && <Text>{ new Date(p.hireDate).toLocaleDateString() }</Text>,
            width: 120,
            isSortable: true,
        },
        {
            key: 'locationName',
            caption: "Location",
            render: p => <Text>{ p.locationName }</Text>,
            width: 180,
            grow: 1,
            isSortable: true,
        },
        {
            key: 'salary',
            caption: "Salary",
            render: p => <Text color='night900'>{ p.salary }</Text>,
            width: 150,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'сonfig',
            render: p => null,
            width: 48,
            fix: 'right',
        },
    ];

    const summaryColumns: DataColumnProps<PersonsSummary>[] = [
        {
            key: 'name',
            caption: "Total Count",
            fix: 'left',
            textAlign: 'right',
            width: 250,
            grow: 1,
            render: p => (
                <FlexRow background='night50'>
                    <Text fontSize='14' font='sans-semibold'>Total</Text>
                    <Text fontSize='14' font='sans-semibold' color='night500'>{ p.totalCount || 0 } records</Text>
                </FlexRow>
            ),
        },
        {
            key: 'jobTitle',
            width: 200,
            grow: 1,
            render: () => <Text fontSize='14'>-</Text>,
        },
        {
            key: 'departmentName',
            width: 200,
            grow: 1,
            render: () => <Text fontSize='14' font='sans-semibold'>-</Text>,
        },
        {
            key: 'birthDate',
            render: () => <Text fontSize='14'>-</Text>,
            width: 120,
        },
        {
            key: 'hireDate',
            render: () => <Text fontSize='14'>-</Text>,
            width: 120,
        },
        {
            key: 'locationName',
            render: () => <Text fontSize='14'>-</Text>,
            width: 180,
            grow: 1,
        },
        {
            key: 'salary',
            caption: "Total Salary",
            render: p => <Text font='sans-semibold' fontSize='14'>{ p.totalSalary }</Text>,
            width: 150,
            textAlign: 'right',
        },
        {
            key: 'сonfig',
            render: p => null,
            width: 48,
            fix: 'right',
        },
    ];

    return {
        personColumns,
        summaryColumns,
    };
}