import * as React from 'react';
import { Text, ColumnPickerFilter } from '@epam/loveship';
import { IEditable, DataQueryFilter, DataColumnProps, LazyDataSource, LazyDataSourceApi, normalizeDataQueryFilter, ILens } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';
import { svc } from '../../services';
import { PersonTableRecordId } from './types';

export function getColumns() {
    function makeFilterRenderCallback<TField extends keyof Person>(fieldName: TField, api: LazyDataSourceApi<any, any, any>) {
        const dataSource = new LazyDataSource({ api });

        const Filter = (props: IEditable<any>) => {
            return <ColumnPickerFilter
                dataSource={ dataSource }
                selectionMode='multi'
                valueType='id'
                emptyValue={ null }
                getName={ i => i.name || "Not Specified" }
                { ...props }
            />;
        };

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
            width: 250,
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

    return {
        personColumns,
        groupColumns,
    };
}