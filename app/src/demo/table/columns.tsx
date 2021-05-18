import * as React from 'react';
import { Text, ColumnPickerFilter, Badge, EpamAdditionalColor, FlexRow, IconButton, LinkButton, Tag, DatePicker, RangeDatePicker } from '@epam/promo';
import { DataQueryFilter, DataColumnProps, ILens, IEditable } from '@epam/uui';
import { City, Department, Person, PersonGroup, Manager, Country, Office } from '@epam/uui-docs';
import { ITableFilter, PersonTableRecordId } from './types';
import * as css from './DemoTable.scss';
import * as viewIcon from '@epam/assets/icons/common/action-eye-18.svg';
import ColumnDatePicker from "./ColumnDatePicker";
import { addFiltersToColumns } from "./helpers";

export function getColumns(filters: ITableFilter[], setInfoPanelId: (id: Person["id"] | null) => void) {
    const makeFilterRenderCallback = (filterKey: string) => {
        const filter = filters.find(f => f.id === filterKey);

        const Filter = (props: IEditable<any>) => {
            switch (filter.type) {
                case "singlePicker":
                    return (
                        <ColumnPickerFilter
                            dataSource={ filter.dataSource }
                            selectionMode="single"
                            valueType="id"
                            getName={ i => i?.name || "Not Specified" }
                            showSearch
                            { ...props }
                        />
                    );
                case "multiPicker":
                    return (
                        <ColumnPickerFilter
                            dataSource={ filter.dataSource }
                            selectionMode="multi"
                            valueType="id"
                            getName={ i => i?.name || "Not Specified" }
                            showSearch
                            { ...props }
                        />
                    );
                case "datePicker":
                    return <DatePicker format="DD/MM/YYYY" { ...props }/>;
                case "rangeDatePicker":
                    return <RangeDatePicker { ...props }/>;
            }
        };

        return (filterLens: ILens<any>) => {
            if (!filter) return null;

            const props = filterLens.prop(filter.id).toProps();
            return <Filter { ...props } />;
        };
    };

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
            filterId: 'profileStatusId',
            render: p => p.profileStatus && <FlexRow>
                <Badge
                    cx={ css.status }
                    fill="transparent"
                    color={ p.profileStatus.toLowerCase() as EpamAdditionalColor }
                    caption={ p.profileStatus }/>
            </FlexRow>,
            grow: 0,
            shrink: 0,
            width: 140,
            isSortable: true,
            isFilterActive: f => !!f.profileStatusId,
        },
        {
            key: 'jobTitle',
            caption: "Title",
            filterId: 'jobTitleId',
            render: r => <Text>{ r.jobTitle }</Text>,
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            isFilterActive: f => !!f.jobTitleId,
        },
        {
            key: 'departmentName',
            caption: "Department",
            filterId: 'departmentId',
            render: p => <Text>{ p.departmentName }</Text>,
            grow: 0,
            shrink: 0,
            width: 200,
            isSortable: true,
            isFilterActive: f => !!f.departmentId,
            isHiddenByDefault: true,
        },
        {
            key: 'officeAddress',
            caption: "Office",
            filterId: 'officeId',
            render: p => <Text cx={ css.office }>{ p.officeAddress }</Text>,
            grow: 0,
            shrink: 0,
            width: 150,
            isSortable: true,
            isFilterActive: f => !!f.officeId,
        },
        {
            key: 'managerName',
            caption: "Manager",
            filterId: 'managerId',
            render: p => <LinkButton caption={ p.managerName } captionCX={ css.managerCell } href="#"/>,
            grow: 0,
            shrink: 0,
            width: 150,
            isSortable: true,
            isFilterActive: f => !!f.managerId,
        },
        {
            key: 'countryName',
            caption: 'Country',
            filterId: 'countryId',
            render: p => <Text>{ p.countryName }</Text>,
            grow: 0,
            shrink: 0,
            width: 150,
            isSortable: true,
            isFilterActive: f => !!f.countryId,
        },
        {
            key: 'cityName',
            caption: 'City',
            filterId: 'cityId',
            render: p => <Text>{ p.cityName }</Text>,
            grow: 0,
            shrink: 0,
            width: 150,
            isSortable: true,
            isFilterActive: f => !!f.cityId,
        },
        {
            key: 'profileType',
            caption: 'Profile Type',
            render: p => <Text>{ p.hireDate ? 'Employee' : 'Student' }</Text>,
            grow: 0,
            shrink: 0,
            width: 150,
        },
        {
            key: 'birthDate',
            caption: "Birth Date",
            filterId: 'birthDate',
            render: p => p?.birthDate && <Text>{ new Date(p.birthDate).toLocaleDateString() }</Text>,
            grow: 0,
            shrink: 0,
            width: 120,
            isSortable: true,
        },
        {
            key: 'relatedNPR',
            caption: "Related NPR",
            render: p => <Text>{ p.relatedNPR ? 'Completed' : 'Uncompleted' }</Text>,
            grow: 0,
            shrink: 0,
            width: 120,
            isSortable: true,
            isHiddenByDefault: true,
        },
        {
            key: 'titleLevel',
            caption: 'Track & Level',
            render: p => <Text>{ p.titleLevel }</Text>,
            grow: 0,
            shrink: 0,
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
            width: 54,
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
        personColumns: addFiltersToColumns(personColumns, filters, makeFilterRenderCallback),
        groupColumns,
    };
}