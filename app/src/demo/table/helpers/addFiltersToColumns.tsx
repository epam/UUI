import React from "react";
import { DataColumnProps, IEditable, ILens } from "@epam/uui";
import { ColumnPickerFilter, DatePicker, RangeDatePicker } from "@epam/promo";
import { ITableFilter } from "../types";

export const addFiltersToColumns = (columns: DataColumnProps<any>[], filters: ITableFilter[]) => {
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