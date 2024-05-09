import * as React from 'react';
import { Text, Badge, FlexRow, IconButton, LinkButton, BadgeProps } from '@epam/uui';
import { DataColumnProps, DataQueryFilter } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import css from './DemoTable.module.scss';
import { ReactComponent as ViewIcon } from '@epam/assets/icons/common/action-eye-18.svg';
import { PersonTableRecordId } from './types';

export const personColumns: DataColumnProps<Person, PersonTableRecordId[], DataQueryFilter<Person>>[] = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 200,
        fix: 'left',
        isSortable: true,
        justifyContent: 'space-between',
        isAlwaysVisible: true,
    }, {
        key: 'profileStatus',
        caption: 'Profile Status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge size="24" indicator fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    }, {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.jobTitleId,
    }, {
        key: 'departmentName',
        caption: 'Department',
        render: (p) => <Text>{p.departmentName}</Text>,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.departmentId,
        isHiddenByDefault: true,
    }, {
        key: 'officeAddress',
        caption: 'Office',
        render: (p) => <Text>{p.officeAddress}</Text>,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.officeId,
    }, {
        key: 'managerName',
        caption: 'Manager',
        render: (p) => <LinkButton caption={ p.managerName } href="#" />,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.managerId,
    }, {
        key: 'countryName',
        caption: 'Country',
        render: (p) => <Text>{p.countryName}</Text>,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.countryId,
    }, {
        key: 'cityName',
        caption: 'City',
        render: (p) => <Text>{p.cityName}</Text>,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.cityId,
    }, {
        key: 'profileType',
        caption: 'Profile Type',
        render: (p) => <Text>{p.hireDate ? 'Employee' : 'Student'}</Text>,
        width: 150,
    }, {
        key: 'birthDate',
        caption: 'Birth Date',
        render: (p) => p?.birthDate && <Text>{new Date(p.birthDate).toLocaleDateString()}</Text>,
        width: 120,
        isSortable: true,
    }, {
        key: 'relatedNPR',
        caption: 'Related NPR',
        render: (p) => <Text>{p.relatedNPR ? 'Completed' : 'Uncompleted'}</Text>,
        width: 120,
        isSortable: true,
        isHiddenByDefault: true,
    }, {
        key: 'titleLevel',
        caption: 'Track & Level',
        render: (p) => <Text>{p.titleLevel}</Text>,
        grow: 1,
        width: 100,
        isSortable: true,
        isHiddenByDefault: true,
    }, {
        key: 'detailed',
        render: () => <IconButton cx={ css.detailedIcon } icon={ ViewIcon } />,
        width: 54,
        alignSelf: 'center',
        fix: 'right',
        allowResizing: false,
    },
];
