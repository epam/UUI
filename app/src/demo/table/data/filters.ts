import { LazyDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { ITableFilter } from "../types";

export const getFilters = (): ITableFilter[] => {
    return [
        {
            key: "profileStatusId",
            title: "Profile Status",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
        },
        {
            key: "jobTitleId",
            title: "Title",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            key: "departmentId",
            title: "Department",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
        {
            key: "officeId",
            title: "Office",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            key: "managerId",
            title: "Manager",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            key: "countryId",
            title: "Country",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
        },
        {
            key: "cityId",
            title: "City",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
    ];
};