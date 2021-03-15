import { LazyDataSource } from "@epam/uui";
import { ITableFilter } from "../types";
import { api } from "./api";

export const filters: ITableFilter[] = [
    {
        key: "profileStatusId",
        title: "Profile Status",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "jobTitleId",
        title: "Title",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "departmentId",
        title: "Department",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "officeId",
        title: "Office",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "managerId",
        title: "Manager",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "countryId",
        title: "Country",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
    {
        key: "cityId",
        title: "City",
        selectionMode: "multi",
        dataSource: new LazyDataSource({ api }),
    },
];