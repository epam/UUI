import * as React from 'react';
import { Text, ColumnPickerFilter, Badge, EpamAdditionalColor, FlexRow, IconButton, LinkButton, Tag } from '@epam/promo';
import { DataQueryFilter, DataColumnProps, LazyDataSource, LazyDataSourceApi, normalizeDataQueryFilter, ILens, IEditable } from '@epam/uui';
import { City, Department, JobTitle, Status, Person, PersonGroup, Manager, Country, Office } from '@epam/uui-docs';
import { svc } from '../../services';
import { PersonTableRecordId } from './types';
import { SidebarPanel } from "./SidebarPanel";
import * as css from './DemoTable.scss';
import * as viewIcon from '@epam/assets/icons/common/action-eye-18.svg';

export function getColumns() {
    function makeFilterRenderCallback<TField extends keyof Person, TId extends number | string, TEntity extends Department | JobTitle | Country | City | Office | Status | Manager>(fieldName: TField, api: LazyDataSourceApi<TEntity, TId, TEntity>) {
        const dataSource = new LazyDataSource({ api });

        const Filter = (props: IEditable<any>) => {
            return <ColumnPickerFilter
                dataSource={ dataSource }
                selectionMode='multi'
                valueType='id'
                emptyValue={ null }
                getName={ i => i.name || "Not Specified" }
                showSearch
                { ...props }
            />;
        };

        return (filterLens: ILens<any>) => <Filter { ...filterLens.onChange((_, value) => normalizeDataQueryFilter(value)).prop(fieldName).prop('in').toProps() } />;
    }

    const renderDepartmentFilter = makeFilterRenderCallback('departmentId', svc.api.demo.departments);
    const renderJobTitlesFilter = makeFilterRenderCallback('jobTitleId', svc.api.demo.jobTitles);
    const renderCountryFilter = makeFilterRenderCallback('countryId', svc.api.demo.countries);
    const renderCityFilter = makeFilterRenderCallback('cityId', svc.api.demo.cities);
    const renderOfficeFilter = makeFilterRenderCallback('officeId', svc.api.demo.offices);
    const renderStatusFilter = makeFilterRenderCallback('profileStatusId', svc.api.demo.statuses);
    const renderManagerFilter = makeFilterRenderCallback('managerId', svc.api.demo.managers);

    const personColumns: DataColumnProps<Person, PersonTableRecordId, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 200,
            minWidth: 100,
            fix: 'left',
            isSortable: true,
        },
        {
            key: 'profileStatus',
            caption: 'Profile Status',
            render: p => p.profileStatus && <FlexRow>
                <Badge
                    cx={ css.status }
                    fill='transparent'
                    color={ p.profileStatus.toLowerCase() as EpamAdditionalColor }
                    caption={ p.profileStatus } />
            </FlexRow>,
            width: 140,
            minWidth: 100,
            isSortable: true,
            renderFilter: renderStatusFilter,
            isFilterActive: f => !!f.profileStatusId,
        },
        {
            key: 'jobTitle',
            caption: "Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 250,
            minWidth: 150,
            isSortable: true,
            renderFilter: renderJobTitlesFilter,
            isFilterActive: f => !!f.jobTitleId,
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: p => <Text>{ p.departmentName }</Text>,
            width: 250,
            minWidth: 150,
            isSortable: true,
            renderFilter: renderDepartmentFilter,
            isFilterActive: f => !!f.departmentId,
            isHiddenByDefault: true,
        },
        {
            key: 'officeAddress',
            caption: "Office",
            render: p => <Text cx={ css.office }>{ p.officeAddress }</Text>,
            width: 150,
            minWidth: 100,
            isSortable: true,
            renderFilter: renderOfficeFilter,
            isFilterActive: f => !!f.officeId,
        },
        {
            key: 'managerName',
            caption: "Manager",
            render: p => <LinkButton caption={ p.managerName } captionCX={ css.managerCell } href='#' />,
            width: 150,
            minWidth: 100,
            isSortable: true,
            renderFilter: renderManagerFilter,
            isFilterActive: f => !!f.managerId,
        },
        {
            key: 'countryName',
            caption: 'Country',
            render: p => <Text>{ p.countryName }</Text>,
            width: 150,
            minWidth: 100,
            isSortable: true,
            renderFilter: renderCountryFilter,
            isFilterActive: f => !!f.countryId,
        },
        {
            key: 'cityName',
            caption: 'City',
            render: p => <Text>{ p.cityName }</Text>,
            width: 150,
            minWidth: 100,
            isSortable: true,
            renderFilter: renderCityFilter,
            isFilterActive: f => !!f.cityId,
        },
        {
            key: 'profileType',
            caption: 'Profile Type',
            render: p => <Text>{ p.hireDate ? 'Employee' : 'Student' }</Text>,
            width: 150,
            minWidth: 100,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            render: p => p?.birthDate && <Text>{ new Date(p.birthDate).toLocaleDateString() }</Text>,
            width: 120,
            minWidth: 80,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'relatedNPR',
            caption: "Related NPR",
            render: p => <Text>{ p.relatedNPR ? 'Completed' : 'Uncompleted' }</Text>,
            width: 120,
            minWidth: 80,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'titleLevel',
            caption: 'Track & Level',
            render: p => <Text>{ p.titleLevel }</Text>,
            width: 150,
            minWidth: 120,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'detailed',
            render: (p) => <IconButton
                cx={ css.detailedIcon }
                icon={ viewIcon }
                onClick={ () => svc.uuiModals.show((props) =>
                    <SidebarPanel
                        data={ p }
                        modalProps={ props }
                    />) }
            />,
            grow: 0, shrink: 0, width: 54,
            alignSelf: 'center',
            fix: 'right',
        },
    ];

    const groupColumns: DataColumnProps<PersonGroup, number, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <FlexRow><Text>{ p.name }</Text><Tag cx={ css.counter } count={ p.count } /></FlexRow>,
            grow: 1,
        },
    ];

    return {
        personColumns,
        groupColumns,
    };
}