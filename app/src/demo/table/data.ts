import { ArrayDataSource } from "@epam/uui";
import { ITableFilter } from "./types";

export const items = [
    {id: "id1", name: "name1"},
    {id: "id2", name: "name2"},
    {id: "id3", name: "name3"},
];

export const filters: ITableFilter[] = [
    {
        key: "name",
        title: "Name",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "profileStatus",
        title: "Profile Status",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "jobTitle",
        title: "Title",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "departmentName",
        title: "Department",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "officeAddress",
        title: "Office",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "managerName",
        title: "Manager",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "countryName",
        title: "Country",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "cityName",
        title: "City",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "profileType",
        title: "Profile Type",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "birthDate",
        title: "Birth Date",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "relatedNPR",
        title: "Related NPR",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "titleLevel",
        title: "Track & Level",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "productionCategory",
        title: "Production Category",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "organizationalCategory",
        title: "Organizational Category",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "uid",
        title: "UID",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
    {
        key: "startDate",
        title: "Start Date",
        type: "multi",
        dataSource: new ArrayDataSource({ items }),
    },
];

export const presets = [
    {
        id: "default",
        name: "Default",
        isActive: true,
    },
    {
        id: "newPreset",
        name: "New Preset",
        isActive: false,
    },
    {
        id: "greenStatus",
        name: "Green Status",
        isActive: false,
    },
    {
        id: "groupByTitle",
        name: "Group By Title",
        isActive: false,
    },
];