import { TableFiltersConfig, LazyDataSource } from '@epam/uui-core';
import { svc } from '../../services';

export const getFilters = <TFilter extends Record<string, any>>(): TableFiltersConfig<TFilter>[] => {
    return [
        {
            field: 'jobTitleId',
            columnKey: 'jobTitle',
            title: 'Job Title',
            type: 'multiPicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        }, {
            field: 'departmentId',
            columnKey: 'departmentName',
            title: 'Department',
            type: 'singlePicker',
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
    ];
};
