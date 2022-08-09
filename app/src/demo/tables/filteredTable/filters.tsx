import React from 'react';
import { TableFiltersConfig, LazyDataSource } from "@epam/uui-core";
import { Country } from "@epam/uui-docs";
import { Badge, DataPickerRow, PickerItem } from "@epam/promo";
import { ReactComponent as myIcon } from '@epam/assets/icons/common/action-account-18.svg';
import { svc } from "../../../services";
import { Person } from "@epam/uui-docs";

export const getFilters = (): TableFiltersConfig<Person>[] => {
    return [
        {
            field: "profileStatusId",
            columnKey: "profileStatus",
            title: "Profile Status",
            type: "multiPicker",
            isAlwaysVisible: true,
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
            renderRow: (props) =>
                <DataPickerRow
                    { ...props }
                    size='36'
                    key={ props.rowKey }
                    renderItem={ (item: any) => <Badge fill='transparent' color={ item.name.toLowerCase() } caption={ item.name } /> }
                />,
        },
        {
            field: "countryId",
            columnKey: "countryName",
            title: "Country",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
            renderRow: (props) =>
                <DataPickerRow
                    { ...props }
                    size='36'
                    key={ props.rowKey }
                    renderItem={ (item: Country, rowProps) => <PickerItem { ...rowProps } title={ item.name } subtitle={ item.capital } /> }
                />,
        },
        {
            field: "jobTitleId",
            columnKey: "jobTitle",
            title: "Title",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            field: "departmentId",
            columnKey: 'departmentName',
            title: "Department",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
        {
            field: "officeId",
            columnKey: "officeAddress",
            title: "Office",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            field: "managerId",
            columnKey: "managerName",
            title: "Manager",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            field: "cityId",
            columnKey: "cityName",
            title: "City",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
        {
            field: "hireDate",
            columnKey: "hireDate",
            title: "Hire Date",
            type: "datePicker",
        },
        {
            field: "birthDate",
            columnKey: "birthDate",
            title: "Birth Date",
            type: "rangeDatePicker",
        },
    ];
};