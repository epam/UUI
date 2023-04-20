import React from 'react';
import { TableFiltersConfig, LazyDataSource, ArrayDataSource } from '@epam/uui-core';
import { Country } from '@epam/uui-docs';
import { Badge, DataPickerRow, PickerItem } from '@epam/uui';
import { defaultPredicates } from '@epam/uui';
import { demoData } from '@epam/uui-docs';
import { svc } from '../../../services';
import { Person } from '@epam/uui-docs';

export const getFilters = (): TableFiltersConfig<Person>[] => {
    return [
        {
            field: 'profileStatusId',
            columnKey: 'profileStatus',
            title: 'Profile Status',
            type: 'multiPicker',
            isAlwaysVisible: true,
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
            renderRow: (props) => (
                <DataPickerRow
                    { ...props }
                    size="36"
                    key={ props.rowKey }
                    renderItem={ (item: any) => <Badge fill="transparent" color={ item.name.toLowerCase() } caption={ item.name } /> }
                />
            ),
            predicates: defaultPredicates.multiPicker,
        },
        {
            field: 'countryId',
            columnKey: 'countryName',
            title: 'Country',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
            renderRow: (props) => (
                <DataPickerRow
                    { ...props }
                    size="36"
                    key={ props.rowKey }
                    renderItem={ (item: Country, rowProps) => <PickerItem { ...rowProps } title={ item.name } subtitle={ item.capital } /> }
                />
            ),
        },
        {
            field: 'jobTitleId',
            columnKey: 'jobTitle',
            title: 'Title',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            field: 'departmentId',
            columnKey: 'departmentName',
            title: 'Department',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
            predicates: [{ predicate: 'eq', name: 'is' }, { predicate: 'neq', name: 'is not' }],
        },
        {
            field: 'officeId',
            columnKey: 'officeAddress',
            title: 'Office',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            field: 'managerId',
            columnKey: 'managerName',
            title: 'Manager',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            field: 'cityId',
            columnKey: 'cityName',
            title: 'City',
            type: 'multiPicker',
            getName: (item) => `${item.name} (${item.countryName})`,
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
        {
            field: 'workload',
            columnKey: 'workload',
            title: 'Workload',
            type: 'singlePicker',
            dataSource: new ArrayDataSource({ items: demoData.workloadItems }),
            predicates: [
                { predicate: 'eq', name: '=' },
                { predicate: 'neq', name: '≠' },
                { predicate: 'lte', name: '≤' },
                { predicate: 'gte', name: '≥' },
            ],
        },
        {
            field: 'salary',
            columnKey: 'salary',
            title: 'Salary',
            type: 'numeric',
            predicates: defaultPredicates.numeric,
        },
        {
            field: 'hireDate',
            columnKey: 'hireDate',
            title: 'Hire Date',
            type: 'datePicker',
        },
        {
            field: 'birthDate',
            columnKey: 'birthDate',
            title: 'Birth Date',
            type: 'rangeDatePicker',
            format: 'YYYY-MM-DD',
            predicates: defaultPredicates.rangeDatePicker,
        },
    ];
};
