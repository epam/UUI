import * as React from 'react';
import { Text, FlexRow } from '@epam/loveship';
import { DataQueryFilter, DataColumnProps, DataColumnGroupProps } from '@epam/uui-core';
import type { Person } from '@epam/uui-docs';
import type { PersonTableRecordId } from './types';
import type { PersonsSummary } from './types';

export function getColumns() {
    const personColumnsGroups: DataColumnGroupProps[] = [
        {
            key: 'name',
            caption: 'Name',
        },
        {
            key: 'position',
            caption: 'Position',
        },
        {
            key: 'amounts',
            caption: 'Amounts',
            textAlign: 'right',
        },
    ];

    const personColumns: DataColumnProps<Person, PersonTableRecordId, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            group: 'name',
            caption: 'Name',
            render: (p) => <Text>{p.name}</Text>,
            width: 250,
            fix: 'left',
            allowResizing: true,
            isSortable: true,
        }, {
            key: 'name2',
            group: 'name',
            caption: 'Name2',
            render: (p) => <Text>{p.name}</Text>,
            width: 250,
            fix: 'left',
            allowResizing: true,
            isSortable: true,
        }, {
            key: 'jobTitle',
            group: 'position',
            caption: 'Job Title',
            render: (r) => <Text>{r.jobTitle}</Text>,
            width: 200,
            allowResizing: true,
            isSortable: true,
            isFilterActive: (f) => !!f.jobTitle,
        }, {
            key: 'departmentName',
            group: 'position',
            caption: 'Department',
            render: (p) => <Text>{p.departmentName}</Text>,
            width: 200,
            allowResizing: true,
            isSortable: true,
            isFilterActive: (f) => !!f.departmentId,
        }, {
            key: 'birthDate',
            group: 'position',
            caption: 'Birth Date',
            render: (p) => p?.birthDate && <Text>{new Date(p.birthDate).toLocaleDateString()}</Text>,
            width: 120,
            allowResizing: true,
            isSortable: true,
        }, {
            key: 'hireDate',
            caption: 'Hire Date',
            render: (p) => p?.hireDate && <Text>{new Date(p.hireDate).toLocaleDateString()}</Text>,
            width: 120,
            allowResizing: true,
            isSortable: true,
        }, {
            key: 'locationName',
            caption: 'Location',
            render: (p) => <Text>{p.locationName}</Text>,
            width: 180,
            allowResizing: true,
            isSortable: true,
        }, {
            key: 'salary',
            group: 'amounts',
            caption: 'Salary',
            render: (p) => <Text color="night900">{p.salary}</Text>,
            width: 150,
            allowResizing: true,
            isSortable: true,
            textAlign: 'right',
        }, {
            key: 'сonfig',
            render: () => null,
            width: 48,
            fix: 'right',
        },
    ];

    const summaryColumns: DataColumnProps<PersonsSummary>[] = [
        {
            key: 'name',
            caption: 'Total Count',
            fix: 'left',
            textAlign: 'right',
            width: 250,
            render: (p) => (
                <FlexRow background="night50">
                    <Text fontSize="14">
                        Total
                    </Text>
                    <Text fontSize="14" color="night500">
                        {p.totalCount || 0}
                        {' '}
                        records
                    </Text>
                </FlexRow>
            ),
        }, {
            key: 'jobTitle',
            group: 'position',
            width: 200,
            render: () => <Text fontSize="14">-</Text>,
        }, {
            key: 'departmentName',
            group: 'position',
            width: 200,
            render: () => (
                <Text fontSize="14">
                    -
                </Text>
            ),
        }, {
            key: 'birthDate',
            render: () => <Text fontSize="14">-</Text>,
            width: 120,
        }, {
            key: 'hireDate',
            render: () => <Text fontSize="14">-</Text>,
            width: 120,
        }, {
            key: 'locationName',
            render: () => <Text fontSize="14">-</Text>,
            width: 180,
        }, {
            key: 'salary',
            caption: 'Total Salary',
            render: (p) => (
                <Text fontSize="14">
                    {p.totalSalary}
                </Text>
            ),
            width: 150,
            textAlign: 'right',
        }, {
            key: 'сonfig',
            render: () => null,
            width: 48,
            fix: 'right',
        },
    ];

    return {
        personColumns,
        summaryColumns,
        personColumnsGroups,
    };
}
