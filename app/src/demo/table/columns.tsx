import * as React from 'react';
import { Text, ColumnPickerFilter, Badge, EpamAdditionalColor, FlexRow, IconButton, LinkButton, Tag } from '@epam/promo';
import { DataQueryFilter, DataColumnProps, normalizeDataQueryFilter, ILens, IEditable } from '@epam/uui';
import { City, Department, Person, PersonGroup, Manager, Country, Office } from '@epam/uui-docs';
import { ITableFilter, PersonTableRecordId } from './types';
import * as css from './DemoTable.scss';
import * as viewIcon from '@epam/assets/icons/common/action-eye-18.svg';

export function getColumns(filters: ITableFilter[], setInfoPanelId: (id: Person["id"] | null) => void) {
    const makeFilterRenderCallback = <TField extends keyof Person>(filterKey: TField) => {
        const filter = filters.find(f => f.key === filterKey);

        const Filter = (props: IEditable<any>) => {
            return <ColumnPickerFilter
                dataSource={ filter.dataSource }
                selectionMode={ filter.selectionMode }
                valueType='id'
                emptyValue={ null }
                getName={ i => (i as any)?.name || "Not Specified" }
                showSearch
                { ...props }
            />;
        };

        return (filterLens: ILens<any>) => {
            const props = filterLens
                .onChange((_, value) => normalizeDataQueryFilter(value))
                .prop(filter.key)
                .prop('in')
                .toProps();

            return <Filter { ...props } />;
        };
    };

    const renderDepartmentFilter = makeFilterRenderCallback('departmentId');
    const renderJobTitlesFilter = makeFilterRenderCallback('jobTitleId');
    const renderCountryFilter = makeFilterRenderCallback('countryId');
    const renderCityFilter = makeFilterRenderCallback('cityId');
    const renderOfficeFilter = makeFilterRenderCallback('officeId');
    const renderStatusFilter = makeFilterRenderCallback('profileStatusId');
    const renderManagerFilter = makeFilterRenderCallback('managerId');

    const personColumns: DataColumnProps<Person, PersonTableRecordId, DataQueryFilter<Person>>[] = [
        {
            key: 'name',
            caption: "Name",
            render: p => <Text>{ p.name }</Text>,
            width: 200,
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
                    caption={ p.profileStatus }/>
            </FlexRow>,
            width: 140,
            isSortable: true,
            renderFilter: renderStatusFilter,
            isFilterActive: f => !!f.profileStatusId,
        },
        {
            key: 'jobTitle',
            caption: "Title",
            render: r => <Text>{ r.jobTitle }</Text>,
            width: 200,
            isSortable: true,
            renderFilter: renderJobTitlesFilter,
            isFilterActive: f => !!f.jobTitleId,
        },
        {
            key: 'departmentName',
            caption: "Department",
            render: p => <Text>{ p.departmentName }</Text>,
            width: 200,
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
            isSortable: true,
            renderFilter: renderOfficeFilter,
            isFilterActive: f => !!f.officeId,
        },
        {
            key: 'managerName',
            caption: "Manager",
            render: p => <LinkButton caption={ p.managerName } captionCX={ css.managerCell } href='#'/>,
            width: 150,
            isSortable: true,
            renderFilter: renderManagerFilter,
            isFilterActive: f => !!f.managerId,
        },
        {
            key: 'countryName',
            caption: 'Country',
            render: p => <Text>{ p.countryName }</Text>,
            width: 150,
            isSortable: true,
            renderFilter: renderCountryFilter,
            isFilterActive: f => !!f.countryId,
        },
        {
            key: 'cityName',
            caption: 'City',
            render: p => <Text>{ p.cityName }</Text>,
            width: 150,
            isSortable: true,
            renderFilter: renderCityFilter,
            isFilterActive: f => !!f.cityId,
        },
        {
            key: 'profileType',
            caption: 'Profile Type',
            render: p => <Text>{ p.hireDate ? 'Employee' : 'Student' }</Text>,
            width: 150,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            render: p => p?.birthDate && <Text>{ new Date(p.birthDate).toLocaleDateString() }</Text>,
            width: 120,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'relatedNPR',
            caption: "Related NPR",
            render: p => <Text>{ p.relatedNPR ? 'Completed' : 'Uncompleted' }</Text>,
            width: 120,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'titleLevel',
            caption: 'Track & Level',
            render: p => <Text>{ p.titleLevel }</Text>,
            width: 100,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'detailed',
            render: (p) => <IconButton
                cx={ css.detailedIcon }
                icon={ viewIcon }
                onClick={ () => setInfoPanelId(p.id) }
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
            render: p => <FlexRow><Text>{ p.name }</Text><Tag cx={ css.counter } count={ p.count }/></FlexRow>,
            grow: 1,
        },
    ];

    return {
        personColumns,
        groupColumns,
    };
}