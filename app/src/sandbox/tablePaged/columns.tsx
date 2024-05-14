import * as React from 'react';
import { Text, FlexRow, IconButton, LinkButton } from '@epam/promo';
import { Badge, BadgeProps } from '@epam/uui';
import { DataColumnProps } from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import css from './DemoTablePaged.module.scss';
import { ReactComponent as ViewIcon } from '@epam/assets/icons/common/action-eye-18.svg';

export const personColumns = [
    {
        key: 'name',
        caption: 'Name',
        render: (p) => <Text>{p.name}</Text>,
        width: 200,
        fix: 'left',
        isSortable: true,
    }, {
        key: 'profileStatus',
        caption: 'Profile Status',
        render: (p) =>
            p.profileStatus && (
                <FlexRow>
                    <Badge indicator size="24" fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
        grow: 0,
        shrink: 0,
        width: 140,
        isSortable: true,
        isFilterActive: (f) => !!f.profileStatusId,
    }, {
        key: 'jobTitle',
        caption: 'Title',
        render: (r) => <Text>{r.jobTitle}</Text>,
        grow: 0,
        shrink: 0,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.jobTitleId,
    }, {
        key: 'departmentName',
        caption: 'Department',
        render: (p) => <Text>{p.departmentName}</Text>,
        grow: 0,
        shrink: 0,
        width: 200,
        isSortable: true,
        isFilterActive: (f) => !!f.departmentId,
        isHiddenByDefault: true,
    }, {
        key: 'officeAddress',
        caption: 'Office',
        render: (p) => <Text>{p.officeAddress}</Text>,
        grow: 0,
        shrink: 0,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.officeId,
    }, {
        key: 'managerName',
        caption: 'Manager',
        render: (p) => <LinkButton caption={ p.managerName } href="#" />,
        grow: 0,
        shrink: 0,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.managerId,
    }, {
        key: 'countryName',
        caption: 'Country',
        render: (p) => <Text>{p.countryName}</Text>,
        grow: 0,
        shrink: 0,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.countryId,
    }, {
        key: 'cityName',
        caption: 'City',
        render: (p) => <Text>{p.cityName}</Text>,
        grow: 0,
        shrink: 0,
        width: 150,
        isSortable: true,
        isFilterActive: (f) => !!f.cityId,
    }, {
        key: 'profileType',
        caption: 'Profile Type',
        render: (p) => <Text>{p.hireDate ? 'Employee' : 'Student'}</Text>,
        grow: 0,
        shrink: 0,
        width: 150,
    }, {
        key: 'birthDate',
        caption: 'Birth Date',
        render: (p) => p?.birthDate && <Text>{new Date(p.birthDate).toLocaleDateString()}</Text>,
        grow: 0,
        shrink: 0,
        width: 120,
        isSortable: true,
    }, {
        key: 'relatedNPR',
        caption: 'Related NPR',
        render: (p) => <Text>{p.relatedNPR ? 'Completed' : 'Uncompleted'}</Text>,
        grow: 0,
        shrink: 0,
        width: 120,
        isSortable: true,
        isHiddenByDefault: true,
    }, {
        key: 'titleLevel',
        caption: 'Track & Level',
        render: (p) => <Text>{p.titleLevel}</Text>,
        grow: 0,
        shrink: 0,
        width: 100,
        isSortable: true,
        isHiddenByDefault: true,
    }, {
        key: 'detailed',
        render: () => <IconButton cx={ css.detailedIcon } icon={ ViewIcon } />,
        width: 54,
        alignSelf: 'center',
        fix: 'right',
    },
] as DataColumnProps<Person, number>[];
