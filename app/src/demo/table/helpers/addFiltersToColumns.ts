import { ReactElement } from "react";
import { DataColumnProps, ILens } from "@epam/uui";
import { ITableFilter } from "../types";

export const addFiltersToColumns = (columns: DataColumnProps<any>[], filters: ITableFilter[], makeFilterRenderCallback: IMakeFilterRenderCallback) => {
    const filterIds = filters.map(f => f.id);
    return columns.map(column => {
        if (filterIds.includes(column.filterId)) {
            return {
                ...column,
                renderFilter: makeFilterRenderCallback(column.filterId),
            };
        } else {
            return column;
        }
    });
};

type IMakeFilterRenderCallback = (filterId: string) => (filterLens: ILens<any>) => ReactElement;
