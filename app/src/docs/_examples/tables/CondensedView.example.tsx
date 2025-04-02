import React, { useMemo, useState } from 'react';
import { DataColumnProps, useLazyDataSource, useUuiContext, UuiContexts } from '@epam/uui-core';
import { DataTable, DataTableProps, Panel, StatusIndicator, StatusIndicatorProps, Text } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { TApi } from '../../../data';
import css from './TablesExamples.module.scss';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function CondensedView(props: ExampleProps) {
    const sizes = getAllPropValues('size', false, props) as DataTableProps<any, any>['size'][];
    const rowSize = sizes[1]; // to make the example work with 4/6 pixel grid design systems
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
                caption: 'Employee name and surname',
                render: (p) => <Text size="30">{p.name}</Text>,
                width: 200,
                fix: 'left',
                isSortable: true,
                info: 'Person full name',
                allowResizing: true,
            },
            {
                key: 'profileStatus',
                caption: 'Profile status',
                render: (p) => p.profileStatus && <StatusIndicator color={ p.profileStatus.toLowerCase() as StatusIndicatorProps['color'] } size="18" caption={ p.profileStatus } />,
                width: 120,
                minWidth: 80,
                isSortable: true,
                alignSelf: 'center',
                info: 'Person Status according his work profile',
                allowResizing: true,
            },
            {
                key: 'primarySkill',
                caption: 'Primary skill',
                render: (p) => <Text size="30">{p.primarySkill}</Text>,
                width: 220,
                isSortable: true,
                info: 'Primary skill',
            },
            {
                key: 'salary',
                caption: 'Salary',
                render: (p) => <Text size="30">{ `$ ${p.salary}`}</Text>,
                isSortable: true,
                width: 80,
                textAlign: 'right',
                info: 'Salary sum for the last year',
                allowResizing: true,
            },
            {
                key: 'jobTitle',
                caption: 'Specialization',
                render: (p) => <Text size="30">{p.jobTitle}</Text>,
                width: 180,
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
                size={ rowSize }
                border={ false }
            />
        </Panel>
    );
}
