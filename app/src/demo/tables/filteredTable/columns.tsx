import * as React from 'react';
import { Text, Badge, FlexRow, LinkButton, BadgeProps } from '@epam/uui';
import { DataColumnProps, getSeparatedValue } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';

export const personColumns: DataColumnProps<Person, number>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 130,
        fix: 'left',
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'profileStatus',
        caption: 'Status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge size="24" indicator fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        grow: 0,
        width: 100,
        isSortable: true,
    },
    {
        key: 'salary',
        caption: 'Salary',
        render: (p) => (
            <Text>
                {getSeparatedValue(+p.salary, {
                    style: 'currency', currency: 'USD', maximumFractionDigits: 2, minimumFractionDigits: 2,
                }, 'en-US')}
            </Text>
        ),
        width: 90,
        textAlign: 'right',
        isSortable: true,
    },
    {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 210,
        isSortable: true,
    },
    {
        key: 'departmentName',
        caption: 'Department',
        render: (p) => <Text>{p.departmentName}</Text>,
        grow: 0,
        width: 200,
        isSortable: true,
        isHiddenByDefault: true,
    },
    {
        key: 'officeAddress',
        caption: 'Office',
        render: (p) => <Text>{p.officeAddress}</Text>,
        grow: 0,
        width: 150,
        isSortable: true,
    },
    {
        key: 'managerName',
        caption: 'Manager',
        render: (p) => <LinkButton caption={ p.managerName } href="#" />,
        grow: 0,
        width: 120,
        isSortable: true,
    },
    {
        key: 'countryName',
        caption: 'Country',
        render: (p) => <Text>{p.countryName}</Text>,
        grow: 0,
        width: 110,
        isSortable: true,
    },
    {
        key: 'cityName',
        caption: 'City',
        render: (p) => <Text>{p.cityName}</Text>,
        grow: 0,
        width: 110,
        isSortable: true,
    },
    {
        key: 'profileType',
        caption: 'Type',
        render: (p) => <Text>{p.hireDate ? 'Employee' : 'Student'}</Text>,
        grow: 0,
        width: 100,
    },
    {
        key: 'birthDate',
        caption: 'Birth Date',
        render: (p) => p?.birthDate && <Text>{new Date(p.birthDate).toLocaleDateString()}</Text>,
        grow: 0,
        width: 90,
        isSortable: true,
    },
    {
        key: 'relatedNPR',
        caption: 'Related NPR',
        render: (p) => <Text>{p.relatedNPR ? 'Completed' : 'Uncompleted'}</Text>,
        grow: 0,
        width: 120,
        isSortable: true,
        isHiddenByDefault: true,
    },
    {
        key: 'titleLevel',
        caption: 'Track & Level',
        render: (p) => <Text>{p.titleLevel}</Text>,
        grow: 1,
        width: 100,
        isSortable: true,
        isHiddenByDefault: true,
    },
    {
        key: 'workload',
        caption: 'Workload',
        render: (p) => (
            <Text>
                {p.workload}
                %
            </Text>
        ),
        width: 90,
        textAlign: 'right',
        isSortable: true,
    },
    {
        key: 'detailed',
        render: () => {},
        width: 54,
        alignSelf: 'center',
        fix: 'right',
        allowResizing: false,
    },
];
