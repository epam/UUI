import React, { useMemo, useState } from 'react';
import {
    Badge, DataTable, EpamAdditionalColor, FlexRow, Panel, Text,
} from '@epam/promo';
import {
    DataColumnProps, useLazyDataSource, useUuiContext, UuiContexts,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import css from './TablesExamples.module.scss';
import { TApi } from '../../../data';

export default function StyledColumnsExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value, onValueChange] = useState({});

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
        },
        [],
    );

    const view = dataSource.useView(value, onValueChange, {
        getRowOptions: () => ({ checkbox: { isVisible: true } }),
    });

    const productColumns: DataColumnProps<Person>[] = useMemo(
        () => [
            {
                key: 'name',
                caption: 'Name',
                render: (p) => <Text>{p.name}</Text>,
                width: 200,
                fix: 'left',
                isSortable: true,
                info: 'Person full name',
            }, {
                key: 'profileStatus',
                caption: 'Profile Status',
                render: (p) =>
                    p.profileStatus && (
                        <FlexRow>
                            <Badge fill="transparent" color={ p.profileStatus.toLowerCase() as EpamAdditionalColor } caption={ p.profileStatus } />
                        </FlexRow>
                    ),
                width: 140,
                minWidth: 80,
                isSortable: true,
                alignSelf: 'center',
                info: 'Person Status according his work profile',
            }, {
                key: 'salary',
                caption: 'Salary',
                render: (p) => <Text>{p.salary}</Text>,
                isSortable: true,
                width: 100,
                textAlign: 'right',
                info: 'Salary sum for the last year',
            }, {
                key: 'jobTitle',
                caption: 'Title',
                render: (r) => <Text>{r.jobTitle}</Text>,
                width: 200,
                grow: 1,
                isSortable: true,
                info: 'Job full description',
            }, {
                key: 'detailed',
                render: () => {},
                width: 54,
                alignSelf: 'center',
                fix: 'right',
                info: 'detailed description',
            },
        ],
        [],
    );

    return (
        <Panel shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                showColumnsConfig={ true }
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
            />
        </Panel>
    );
}
