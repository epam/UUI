import React from 'react';
import { DataColumnProps, DataTableHeaderRowProps } from '@epam/uui-core';
import { DocBuilder } from '@epam/uui-docs';
import { Text, FlexCell, LinkButton, ControlSize } from '@epam/loveship';
import { Avatar } from '@epam/uui-components';
import css from '../pickers/DataPickerRowDoc.scss';
import { ReactComponent as MoreIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/common/action-calendar-18.svg';
import { ReactComponent as TickIcon } from '@epam/assets/icons/common/notification-done-18.svg';
import { ReactComponent as PencilIcon } from '@epam/assets/icons/common/content-edit-18.svg';
import { Person } from './TableContext';
import { DataTableHeaderRowMods } from '@epam/uui';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const UserColumns = [
    {
        key: 'person',
        caption: 'ABOUT PERSON',
        render: (data: Person) => (
            <div style={{ display: 'flex', padding: '6px 0' }}>
                <Avatar size="48" img={data.avatarUrl} />
                <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Text size="30" cx={css.userName}>
                        {data.name}
                    </Text>
                    <Text size="24" color="night400" cx={css.userTitle}>
                        {data.jobTitle}
                    </Text>
                </div>
            </div>
        ),
        grow: 1,
        width: 300,
    },
    {
        key: 'inProgress',
        caption: 'IN PROGRESS',
        render: (data: Person) => <LinkButton caption={getRandomInt(1, 10)} icon={CalendarIcon} size="30" />,
        grow: 1,
        width: 50,
        vPadding: '30',
        size: '30',
    },
    {
        key: 'done',
        caption: 'DONE',
        render: (data: Person) => <LinkButton caption={getRandomInt(1, 10)} icon={TickIcon} size="30" />,
        grow: 1,
        width: 50,
        vPadding: '30',
        size: '30',
    },
    {
        key: 'edited',
        caption: 'EDITED',
        render: (data: Person) => <LinkButton caption={getRandomInt(1, 10)} icon={PencilIcon} size="30" />,
        grow: 1,
        width: 50,
        vPadding: '30',
        size: '30',
    },
] as DataColumnProps[];

function getColumns(size: ControlSize, addFixed: boolean, count?: number) {
    const columns = [
        {
            key: 'name',
            caption: 'Name',
            render: (data: Person) => <LinkButton caption={data.name} onClick={() => {}} size={size} />,
            grow: 1,
            width: 150,
            isSortable: true,
        },
        {
            key: 'phoneNumber',
            caption: 'Phone Number',
            render: (data: Person) => (
                <Text color="night400" size={size} font="sans-semibold">
                    {data.phoneNumber}
                </Text>
            ),
            width: 140,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'gender',
            caption: 'Gender',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.gender}
                </Text>
            ),
            width: 60,
            isSortable: true,
            textAlign: 'center',
        },
        {
            key: 'personType',
            caption: 'Person Type',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.personType}
                </Text>
            ),
            width: 120,
            isSortable: true,
            info: (
                <FlexCell>
                    <Text font="sans-semibold">Some title</Text>
                    <Text>this column has info prop</Text>
                </FlexCell>
            ),
        },
        {
            key: 'jobTitle',
            caption: 'Job Title with long long text',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.jobTitle}
                </Text>
            ),
            width: 160,
            isSortable: true,
            //renderFilter: demoFilter,
            isFilterActive: (filter) => filter.jobTitle && !!filter.jobTitle.length,
            info: (
                <FlexCell>
                    <Text font="sans-semibold">Job Title with long long text</Text>
                </FlexCell>
            ),
        },
        {
            key: 'birthDate',
            caption: 'Birth Date',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.birthDate}
                </Text>
            ),
            width: 120,
            isSortable: true,
        },
        {
            key: 'hireDate',
            caption: 'Hire Date',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.hireDate}
                </Text>
            ),
            width: 120,
            isSortable: true,
        },
        {
            key: 'departmentId',
            caption: 'Department Id',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.departmentId}
                </Text>
            ),
            width: 100,
            isSortable: true,
        },
        {
            key: 'departmentName',
            caption: 'Department Name',
            render: (data: Person) => (
                <Text size={size} font="sans-semibold">
                    {data.departmentName}
                </Text>
            ),
            width: 120,
            isSortable: true,
        },
        {
            key: 'settings',
            caption: '',
            render: (data: Person) => <LinkButton icon={MoreIcon} size={size} />,
            width: 18,
            textAlign: 'center',
            alignSelf: 'center',
        },
    ] as DataColumnProps<Person>[];

    if (count) {
        columns.splice(count + 1);
    }

    if (addFixed) {
        columns[0].fix = 'left';
        columns[columns.length - 1].fix = 'right';
    }

    return columns;
}

export const ColumnsHeaderRowDoc = new DocBuilder<DataTableHeaderRowProps & DataTableHeaderRowMods>({ name: 'ColumnsHeaderRowDoc' }).prop('columns', {
    examples: (ctx) => {
        return [
            {
                name: 'basic (30)',
                value: getColumns('30', false, 3),
            },
            {
                name: 'advanced (24)',
                value: getColumns('24', true),
            },
            {
                name: 'advanced (30)',
                value: getColumns('30', true),
                isDefault: true,
            },
            {
                name: 'advanced (36)',
                value: getColumns('36', true),
                isDefault: true,
            },
            {
                name: 'all scrollable (30)',
                value: getColumns('30', false),
            },
            {
                name: 'custom (30)',
                value: UserColumns,
            },
        ];
    },
    isRequired: true,
});
