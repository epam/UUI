import { LazyDataSource } from "@epam/uui";
import { svc } from "../../../services";
import { ITableFilter } from "../types";

export const getFilters = (): ITableFilter[] => {
    return [
        {
            id: "profileStatusId",
            title: "Profile Status",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.statuses }),
        },
        {
            id: "jobTitleId",
            title: "Title",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
        {
            id: "departmentId",
            title: "Department",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.departments }),
        },
        {
            id: "officeId",
            title: "Office",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.offices }),
        },
        {
            id: "managerId",
            title: "Manager",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.managers }),
        },
        {
            id: "countryId",
            title: "Country",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.countries }),
        },
        {
            id: "cityId",
            title: "City",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.cities }),
        },
    ];
};