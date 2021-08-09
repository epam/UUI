import { LazyDataSource } from "@epam/uui";
import { svc } from "../../services";

export const getFilters = (): any => {
    return [
        {
            id: "jobTitleId",
            title: "Title",
            selectionMode: "multi",
            dataSource: new LazyDataSource({ api: svc.api.demo.jobTitles }),
        },
    ];
};