import React, { useState } from 'react';
import { DataSourceState, DataColumnProps, useUuiContext, useLazyDataSource, DataColumnGroupProps } from '@epam/uui-core';
import { Text, DataTable, Panel, FlexRow, Badge, BadgeProps } from '@epam/uui';
import { Person } from '@epam/uui-docs';

import css from './TablesExamples.module.scss';
import { TApi } from '../../../data';

export default function TableGroupedHeaderExample() {
    const svc = useUuiContext<TApi>();
    const [tableState, setTableState] = useState<DataSourceState>({});

    // Define columns groups array
    const columnGroups: DataColumnGroupProps[] = [
        {
            key: 'location',
            caption: 'Location',
            textAlign: 'center',
        },
        {
            key: 'position',
            caption: 'Position',
            textAlign: 'center',
        },
    ];

    // Define columns config array
    const personColumns: DataColumnProps<Person, number>[] = [
        {
            key: 'name',
            caption: 'Name',
            render: (p) => <Text>{p.name}</Text>,
            width: 130,
            isSortable: true,
        },
        {
            key: 'profileStatus',
            caption: 'Status',
            render: (p) => (
                <FlexRow>
                    <Badge size="24" indicator fill="outline" color={ p.profileStatus.toLowerCase() as BadgeProps['color'] } caption={ p.profileStatus } />
                </FlexRow>
            ),
            grow: 0,
            width: 100,
            minWidth: 90,
            isSortable: true,
        },
        {
            key: 'countryName',
            caption: 'Country',
            group: 'location', // Specify group key
            render: (p) => <Text>{p.countryName}</Text>,
            grow: 0,
            width: 110,
            isSortable: true,
        },
        {
            key: 'cityName',
            caption: 'City',
            group: 'location', // Specify group key
            render: (p) => <Text>{p.cityName}</Text>,
            grow: 0,
            width: 110,
            isSortable: true,
        },
        {
            key: 'officeAddress',
            caption: 'Office',
            group: 'location', // Specify group key
            render: (p) => <Text>{p.officeAddress}</Text>,
            grow: 0,
            width: 140,
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: 'Title',
            group: 'position', // Specify group key
            render: (r) => <Text>{r.jobTitle}</Text>,
            width: 170,
            isSortable: true,
        },
        {
            key: 'titleLevel',
            caption: 'Track & Level',
            group: 'position', // Specify group key
            render: (p) => <Text>{p.titleLevel}</Text>,
            width: 110,
            isSortable: true,
        },
        {
            key: 'actions',
            caption: '',
            render: () => {},
            width: 54,
            fix: 'right',
        },
    ];

    const citiesDS = useLazyDataSource<Person, number, unknown>({
        api: svc.api.demo.persons,
        backgroundReload: true,
    }, []);

    const view = citiesDS.useView(tableState, setTableState);

    return (
        <Panel background="surface-main" shadow cx={ css.container }>
            <DataTable
                value={ tableState }
                onValueChange={ setTableState }
                { ...view.getListProps() }
                getRows={ view.getVisibleRows }
                showColumnsConfig={ true }
                columnGroups={ columnGroups }
                columns={ personColumns }
                headerTextCase="upper"
            />
        </Panel>
    );
}
