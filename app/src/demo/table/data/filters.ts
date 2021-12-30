import { LazyDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { ITableFilter } from "../types";

export const getFilters = (): ITableFilter[] => {
    return [
        {
            id: "profileStatusId",
            key: "profileStatus",
            title: "Profile Status",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
        },
        {
            id: "jobTitleId",
            key: "jobTitle",
            title: "Title",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            id: "departmentId",
            key: 'departmentName',
            title: "Department",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
        {
            id: "officeId",
            key: "officeAddress",
            title: "Office",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            id: "managerId",
            key: "managerName",
            title: "Manager",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            id: "countryId",
            key: "countryName",
            title: "Country",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
        },
        {
            id: "cityId",
            key: "cityName",
            title: "City",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
        {
            id: "birthDate",
            key: "birthDate",
            title: "Birth Date",
            type: "rangeDatePicker",
        },
    ];
};