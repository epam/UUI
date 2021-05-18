import { LazyDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { ITableFilter } from "../types";

export const getFilters = (): ITableFilter[] => {
    return [
        {
            id: "profileStatusId",
            title: "Profile Status",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
        },
        {
            id: "jobTitleId",
            title: "Title",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            id: "departmentId",
            title: "Department",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
        {
            id: "officeId",
            title: "Office",
            type: "singlePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            id: "managerId",
            title: "Manager",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            id: "countryId",
            title: "Country",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
        },
        {
            id: "cityId",
            title: "City",
            type: "multiPicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
        {
            id: "birthDate",
            title: "Birth Date",
            type: "rangeDatePicker",
            dataSource: new LazyDataSource({ api: svc.api.demo.birthDates }),
        },
    ];
};