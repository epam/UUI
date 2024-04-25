import React from 'react';
import { TableFiltersConfig, LazyDataSource, ArrayDataSource } from '@epam/uui-core';
import { Country, demoData, Person } from '@epam/uui-docs';
import { Badge, DataPickerRow, PickerItem, defaultPredicates, FlexRow, BadgeProps } from '@epam/uui';
import { svc } from '../../../services';

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
                    padding="12"
                    size="36"
                    alignItems="center"
                    key={ props.rowKey }
                    renderItem={ (item: any) => <FlexRow size="36"><Badge size="24" fill="outline" indicator color={ item.name.toLowerCase() as BadgeProps['color'] } caption={ item.name } /></FlexRow> }
                />
            ),
            predicates: defaultPredicates.multiPicker,
            showSearch: false,
        }, {
            field: 'countryId',
            columnKey: 'countryName',
            title: 'Country',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
            renderRow: (props, dataSourceState) => (
                <DataPickerRow
                    { ...props }
                    size="36"
                    padding="12"
                    key={ props.rowKey }
                    renderItem={ (item: Country, rowProps) => (
                        <PickerItem
                            { ...rowProps }
                            title={ item.name }
                            subtitle={ item.capital }
                            dataSourceState={ dataSourceState }
                        />
                    ) }
                />
            ),
        }, {
            field: 'jobTitleId',
            columnKey: 'jobTitle',
            title: 'Title',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        }, {
            field: 'departmentId',
            columnKey: 'departmentName',
            title: 'Department',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
            predicates: [{ predicate: 'eq', name: 'is' }, { predicate: 'neq', name: 'is not' }],
        }, {
            field: 'officeId',
            columnKey: 'officeAddress',
            title: 'Office',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        }, {
            field: 'managerId',
            columnKey: 'managerName',
            title: 'Manager',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        }, {
            field: 'cityId',
            columnKey: 'cityName',
            title: 'City',
            type: 'multiPicker',
            getName: (item) => `${item.name} (${item.countryName})`,
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        }, {
            field: 'workload',
            columnKey: 'workload',
            title: 'Workload',
            type: 'singlePicker',
            dataSource: new ArrayDataSource({ items: demoData.workloadItems }),
            predicates: [
                { predicate: 'eq', name: '=' }, { predicate: 'neq', name: '≠' }, { predicate: 'lte', name: '≤' }, { predicate: 'gte', name: '≥' },
            ],
            showSearch: false,
        }, {
            field: 'salary',
            columnKey: 'salary',
            title: 'Salary',
            type: 'numeric',
            predicates: defaultPredicates.numeric,
        }, {
            field: 'hireDate',
            columnKey: 'hireDate',
            title: 'Hire Date',
            type: 'datePicker',
        }, {
            field: 'birthDate',
            columnKey: 'birthDate',
            title: 'Birth Date',
            type: 'rangeDatePicker',
            filter: (day) => day.isSameOrBefore(new Date()),
            format: 'YYYY-MM-DD',
            predicates: defaultPredicates.rangeDatePicker,
        },
    ];
};
