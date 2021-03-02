import React from 'react';
import { DataColumnProps, DataTableHeaderRowProps } from '@epam/uui';
import { DocBuilder } from '@epam/uui-docs';
import { Text, FlexCell, LinkButton, ControlSize } from '../../../components';
import {  Avatar } from '@epam/uui-components';
import * as css from '../../pickers/docs/DataPickerRowDoc.scss';
import * as moreIcon from '../../icons/navigation-more_vert-18.svg';
import * as calendarIcon from '../../icons/action-calendar-18.svg';
import * as tickIcon from '../../icons/notification-done-18.svg';
import * as pencilIcon from '../../icons/content-edit-18.svg';
import { Person } from './TableContext';
import { DataTableHeaderRowMods } from '../types';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const UserColumns = [
    {
        key: 'person',
        caption: 'ABOUT PERSON',
        render: (data: Person) => <div style={ { display: 'flex', padding: '6px 0' } }>
            <Avatar size='48' img={ data.avatarUrl } />
            <div style={ { marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                <Text size='30' cx={ css.userName }>
                    { data.name }
                </Text>
                <Text size='24' color='night400' cx={ css.userTitle }>
                    { data.jobTitle }
                </Text>
            </div>
        </div>,
        grow: 1, minWidth: 300,
    },
    {
        key: 'inProgress',
        caption: 'IN PROGRESS',
        render: (data: Person) => <LinkButton caption={ getRandomInt(1, 10) } icon={ calendarIcon } size='30' color='night400' />,
        grow: 1, minWidth: 50,
        vPadding: '30',
        size: '30',
    },
    {
        key: 'done',
        caption: 'DONE',
        render: (data: Person) => <LinkButton caption={ getRandomInt(1, 10) } icon={ tickIcon } size='30' color='night400' />,
        grow: 1, minWidth: 50,
        vPadding: '30',
        size: '30',
    },
    {
        key: 'edited',
        caption: 'EDITED',
        render: (data: Person) => <LinkButton caption={ getRandomInt(1, 10) } icon={ pencilIcon } size='30' color='night400' />,
        grow: 1, minWidth: 50,
        vPadding: '30',
        size: '30',
    },
] as DataColumnProps<any, any>[];


function getColumns(size: ControlSize, addFixed: boolean, count?: number) {
    let columns = [
        {
            key: 'name',
            caption: 'Name',
            render: (data: Person) => <LinkButton caption={ data.name } onClick={ () => { } } size={ size } />,
            grow: 1, minWidth: 150,
            isSortable: true,
        },
        {
            key: 'phoneNumber',
            caption: 'Phone Number',
            render: (data: Person) => <Text color='night400' size={ size } font='sans-semibold'>{ data.phoneNumber }</Text>,
            grow: 0, shrink: 0, width: 140,
            isSortable: true,
            textAlign: 'right',
        },
        {
            key: 'gender',
            caption: 'Gender',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.gender }</Text>,
            grow: 0, shrink: 0, width: 60,
            isSortable: true,
            textAlign: 'center',
        },
        {
            key: 'personType',
            caption: 'Person Type',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.personType }</Text>,
            grow: 0, shrink: 0, width: 120,
            isSortable: true,
            info: <FlexCell>
                <Text font='sans-semibold'>Some title</Text>
                <Text>this column has info prop</Text>
            </FlexCell>,
        },
        {
            key: 'jobTitle',
            caption: 'Job Title with long long text',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.jobTitle }</Text>,
            grow: 0, shrink: 0, width: 160,
            isSortable: true,
            //renderFilter: demoFilter,
            isFilterActive: filter => filter.jobTitle && !!filter.jobTitle.length,
            info: <FlexCell>
                <Text font='sans-semibold'>Job Title with long long text</Text>
            </FlexCell>,
        },
        {
            key: 'birthDate',
            caption: 'Birth Date',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.birthDate }</Text>,
            grow: 0, shrink: 0, width: 120,
            isSortable: true,
        },
        {
            key: 'hireDate',
            caption: 'Hire Date',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.hireDate }</Text>,
            grow: 0, shrink: 0, width: 120,
            isSortable: true,
        },
        {
            key: 'departmentId',
            caption: 'Department Id',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.departmentId }</Text>,
            grow: 0, shrink: 0, width: 100,
            isSortable: true,
        },
        {
            key: 'departmentName',
            caption: 'Department Name',
            render: (data: Person) => <Text size={ size } font='sans-semibold'>{ data.departmentName }</Text>,
            grow: 0, shrink: 0, width: 120,
            isSortable: true,
        },
        {
            key: 'settings',
            caption: '',
            render: (data: Person) => <LinkButton icon={ moreIcon } size={ size } color='night700' />,
            width: 18,
            textAlign: 'center',
            alignSelf: 'center',
        },
    ] as DataColumnProps<Person>[];

    if (count) {
        columns = columns.slice(0, count);
    }

    if (addFixed) {
        columns[0].fix = 'left';
        columns[columns.length - 1].fix = 'right';
    }

    return columns;
}

export const ColumnsHeaderRowDoc = new DocBuilder<DataTableHeaderRowProps<any, any> & DataTableHeaderRowMods>({ name: 'ColumnsHeaderRowDoc' })
    .prop('columns', {
        examples: ctx => {
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
