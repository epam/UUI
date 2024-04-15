'use client';

import {
    DataTable,
    Panel,
    Text,
    defaultPredicates,
    FiltersPanel,
    FlexRow,
} from '@epam/promo';
import React, { useMemo } from 'react';
import {
    DataColumnProps,
    useLazyDataSource,
    LazyDataSource,
    useUuiContext,
    useTableState,
    TableFiltersConfig,
} from '@epam/uui-core';
import { Person } from '@epam/uui-docs';
import { withErrorHandle } from '../../components/withErrorHandle';

const personsColumns: DataColumnProps<Person>[] = [
    {
        key: 'name',
        caption: 'NAME',
        render: (person) => (
            <Text
                color='gray80'
                fontWeight='400'
            >
                {person.name}
            </Text>
        ),
        isSortable: true,
        fix: 'left',
        grow: 1,
        width: 250,
        minWidth: 224,
    },
    {
        key: 'profileStatus',
        caption: 'Profile Status',
        render: (person) => (
            <Text
                color='gray80'
                fontWeight='400'
            >
                {person.profileStatus}
            </Text>
        ),
        isSortable: true,
        width: 200,
    },
    {
        key: 'city',
        caption: 'City',
        render: (person) => <Text>{person.cityName}</Text>,
        width: 150,
    },
    {
        key: 'country',
        caption: 'Country',
        render: (person) => <Text>{person.countryName}</Text>,
        width: 150,
    },
];

const TableExample = () => {
    const svc = useUuiContext();

    const filters = useMemo((): TableFiltersConfig<Person>[] => {
        return [
            {
                field: 'cityId',
                columnKey: 'city',
                title: 'City',
                type: 'multiPicker',
                isAlwaysVisible: true,
                dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
                predicates: defaultPredicates.multiPicker,
            },
            {
                field: 'countryId',
                columnKey: 'country',
                title: 'Country',
                type: 'multiPicker',
                dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
                predicates: defaultPredicates.multiPicker,
            },
        ];
    }, [svc.api.demo.cities, svc.api.demo.countries]);

    const { tableState, setTableState } = useTableState<Person>({
        columns: personsColumns,
        filters: filters,
    });

    const dataSource = useLazyDataSource<Person, number, unknown>(
        { api: svc.api.demo.persons },
        []
    );
    const view = dataSource.useView(tableState, setTableState, {});

    return (
        <div className={'withGap'}>
            <h2>Demo example with table</h2>
            <FlexRow columnGap='6'>
                <FiltersPanel
                    filters={filters}
                    tableState={tableState}
                    setTableState={setTableState}
                />
            </FlexRow>
            <Panel
                shadow
                rawProps={{
                    style: {
                        width: '100%',
                        height: 'auto',
                        maxHeight: '600px',
                        borderRadius: 0,
                    },
                }}
            >
                <DataTable
                    {...view.getListProps()}
                    getRows={view.getVisibleRows}
                    value={tableState}
                    filters={filters}
                    onValueChange={setTableState}
                    columns={personsColumns}
                    headerTextCase='upper'
                />
            </Panel>
        </div>
    );
};

export default withErrorHandle(TableExample);
