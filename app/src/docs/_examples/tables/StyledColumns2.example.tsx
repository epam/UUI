import React, { useMemo, useState } from 'react';
import { DataColumnProps, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { DataTable, FlexRow, Panel, StatusIndicator, StatusIndicatorProps, Text } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { TApi } from '../../../data';
import css from './TablesExamples.module.scss';

export default function StyledColumnsExample() {
    const svc = useUuiContext<TApi, UuiContexts>();

    const [value, onValueChange] = useState({});

    const dataSource = useLazyDataSource<Person, number, Person>(
        {
            api: svc.api.demo.persons,
            backgroundReload: true,
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
                caption: 'Employee name',
                render: (p) => <Text>{p.name}</Text>,
                width: 160,
                fix: 'left',
                isSortable: true,
                info: 'Person full name',
                allowResizing: true,
            },
            {
                key: 'profileStatus',
                caption: 'Uninterrupted employment worker status',
                render: (p) =>
                    p.profileStatus && (
                        <FlexRow>
                            <StatusIndicator color={ p.profileStatus.toLowerCase() as StatusIndicatorProps['color'] } size="18" caption={ p.profileStatus } />
                        </FlexRow>
                    ),
                width: 180,
                minWidth: 80,
                isSortable: true,
                alignSelf: 'center',
                info: 'Person Status according his work profile',
                allowResizing: true,
            },
            {
                key: 'primarySkill',
                caption: 'Primary skill',
                render: (r) => <Text>{r.primarySkill}</Text>,
                width: 200,
                isSortable: true,
                info: 'Primary skill',
            },
            {
                key: 'salary',
                caption: 'Salary',
                render: (p) => <Text>{ `$ ${p.salary}`}</Text>,
                isSortable: true,
                width: 100,
                textAlign: 'right',
                info: 'Salary sum for the last year',
                allowResizing: true,
            },
            {
                key: 'jobTitle',
                caption: 'Specialization',
                render: (r) => <Text>{r.jobTitle}</Text>,
                width: 200,
                grow: 1,
                isSortable: true,
                info: 'Job full description',
                allowResizing: false,
            },
        ],
        [],
    );

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                value={ value }
                onValueChange={ onValueChange }
                columns={ productColumns }
                showColumnsConfig={ true }
                allowColumnsResizing={ true }
                allowColumnsReordering={ true }
                columnsGap="12"
                headerSize="48"
            />
        </Panel>
    );
}
