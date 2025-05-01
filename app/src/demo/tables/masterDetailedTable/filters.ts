import { TableFiltersConfig, LazyDataSource } from '@epam/uui-core';
import { svc } from '../../../services';
import { defaultPredicates } from '@epam/uui';

export const getFilters = <TFilter extends Record<string, any>>(): TableFiltersConfig<TFilter>[] => {
    return [
        {
            field: 'profileStatusId',
            columnKey: 'profileStatus',
            title: 'Profile Status',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
            predicates: defaultPredicates.multiPicker,
            showSearch: false,
        }, {
            field: 'jobTitleId',
            columnKey: 'jobTitle',
            title: 'Title',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
            predicates: defaultPredicates.multiPicker,
            showSearch: true,
        }, {
            field: 'salary',
            columnKey: 'salary',
            title: 'Salary',
            type: 'numeric',
            predicates: defaultPredicates.numeric,
        }, {
            field: 'title',
            columnKey: 'title',
            title: 'Title',
            type: 'numeric',
            predicates: defaultPredicates.multiPicker,
        }, {
            field: 'departmentId',
            columnKey: 'departmentName',
            title: 'Department',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
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
            field: 'countryId',
            columnKey: 'countryName',
            title: 'Country',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
            predicates: [{ predicate: 'in', name: 'is', isDefault: true }, { predicate: 'nin', name: 'is not' }],
        }, {
            field: 'cityId',
            columnKey: 'cityName',
            title: 'City',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        }, {
            field: 'birthDate',
            columnKey: 'birthDate',
            title: 'Birth Date',
            type: 'rangeDatePicker',
            format: 'YYYY-MM-DD',
            predicates: defaultPredicates.rangeDatePicker,
        },
    ];
};
