import * as React from 'react';
import { Text, ColumnPickerFilter, FlexRow } from '@epam/loveship';
import { IEditable, DataQueryFilter, DataColumnProps, LazyDataSource, LazyDataSourceApi, normalizeDataQueryFilter, ILens } from '@epam/uui';
import { svc } from '../../services';
import type { Person, PersonGroup } from '@epam/uui-docs';
import type { PersonTableRecordId } from './types';
import type { PersonsSummary } from './PersonsTableDemo';

export function getColumns() {
    function makeFilterRenderCallback<TField extends keyof Person>(fieldName: TField, api: LazyDataSourceApi<any, any, any>) {
        const dataSource = new LazyDataSource({ api });

        const Filter = (props: IEditable<any>) => (
            <ColumnPickerFilter
                dataSource={ dataSource }
                selectionMode='multi'
                valueType='id'
                emptyValue={ null }
                getName={ i => i.name || "Not Specified" }
                { ...props }
            />
        );

        return (filterLens: ILens<any>) => <Filter { ...filterLens.onChange((_, value) => normalizeDataQueryFilter(value)).prop(fieldName).prop('in').toProps() } />;
    }

    const renderDepartmentFilter = makeFilterRenderCallback('departmentId', svc.api.demo.departments);

    const renderJobTitlesFilter = makeFilterRenderCallback('jobTitleId', svc.api.demo.jobTitles);

    const personColumns: DataColumnProps<Person, PersonTableRecordId, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 250,
            fix: 'left',
            isSortable: true,
        },
        {
            key: 'jobTitle',
            caption: "Job Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 200,
            isSortable: true,
            renderFilter: renderJobTitlesFilter,
            isFilterActive: f => !!f.jobTitle,
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: p => <Text>{ p.departmentName }</Text>,
            width: 200,
            isSortable: true,
            renderFilter: renderDepartmentFilter,
            isFilterActive: f => !!f.departmentId,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            render: p => p?.birthDate && <Text>{ new Date(p.birthDate).toLocaleDateString() }</Text>,
            width: 120,
            isSortable: true,
        },
        {
            key: 'hireDate',
            caption: "Hire Date",
            render: p => p?.hireDate && <Text>{ new Date(p.hireDate).toLocaleDateString() }</Text>,
            width: 120,
            isSortable: true,
        },
        {
            key: 'locationName',
            caption: "Location",
            render: p => <Text>{ p.locationName }</Text>,
            width: 120,
            isSortable: true,
        },
        {
            key: 'salary',
            caption: "Salary",
            render: p => <Text color='night900'>{ p.salary }</Text>,
            width: 150,
            isSortable: true,
        },
    ];

    const groupColumns: DataColumnProps<PersonGroup, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            grow: 1,
        },
    ];

    const summaryColumns: DataColumnProps<PersonsSummary>[] = [
        {
            key: 'name',
            caption: "Total Count",
            fix: 'left',
            textAlign: 'right',
            width: 250,
            render: p => (
                <FlexRow background='night50'>
                    <Text fontSize='14' font='sans-semibold'>Total</Text>
                    <Text fontSize='14' font='sans-semibold' color='night500'>{ p.totalCount || 0 } records</Text>
                </FlexRow>
            ),
        },
        {
            key: 'jobTitle',
            width: 200,
            render: () => <Text fontSize='14'>-</Text>,
        },
        {
            key: 'departmentName',
            width: 200,
            render: () => <Text fontSize='14' font='sans-semibold'>-</Text>,
        },
        {
            key: 'birthDate',
            render: () => <Text fontSize='14'>-</Text>,
            width: 120,
        },
        {
            key: 'hireDate',
            render: () => <Text fontSize='14'>-</Text>,
            width: 120,
        },
        {
            key: 'locationName',
            render: () => <Text fontSize='14'>-</Text>,
            width: 120,
        },
        {
            key: 'salary',
            caption: "Total Salary",
            render: p => <Text font='sans-semibold' fontSize='14'>{ p.totalSalary }</Text>,
            width: 150,
        },
    ];

    return {
        personColumns,
        groupColumns,
        summaryColumns,
    };
}