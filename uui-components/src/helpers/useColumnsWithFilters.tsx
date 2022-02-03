import React, { useRef } from "react";
import { DataColumnProps, IEditable, ILens, FilterConfig, useUuiContext } from "@epam/uui";

export const useColumnsWithFilters = <TFilter extends Record<string, any>>(columns: DataColumnProps[], filters: FilterConfig<TFilter>[] | undefined) => {
    const columnsRef = useRef(columns);
    const context = useUuiContext();
    
    const makeFilterRenderCallback = (key: string) => {
        const filter = filters.find(f => f.columnKey === key);

        const Filter = (props: IEditable<any>) => {
            switch (filter.type) {
                case "singlePicker":
                    return context.uuiSkin.skin.ColumnPickerFilter.render({
                        dataSource: filter.dataSource,
                        selectionMode: "single",
                        valueType: "id",
                        getName: i => i?.name || "Not Specified",
                        showSearch: true,
                        ...props,
                    });
                case "multiPicker":
                    return context.uuiSkin.skin.ColumnPickerFilter.render({
                        dataSource: filter.dataSource,
                        selectionMode: "multi",
                        valueType: "id",
                        getName: i => i?.name || "Not Specified",
                        showSearch: true,
                        ...props,
                    });
                case "datePicker":
                    return context.uuiSkin.skin.DatePicker.render({ format: "DD/MM/YYYY", ...props });
                case "rangeDatePicker":
                    return context.uuiSkin.skin.RangeDatePicker.render(props);
            }
        };

        return (filterLens: ILens<any>) => {
            if (!filter) return null;

            const props = filterLens.prop(filter.field).toProps();
            return <Filter { ...props } />;
        };
    };

    if (filters) {
        const filterKeys = filters.map(f => f.columnKey);
        columnsRef.current = (columns.map(column => {
            if (filterKeys.includes(column.key)) {
                return {
                    ...column,
                    renderFilter: makeFilterRenderCallback(column.key),
                };
            } else {
                return column;
            }
        }));
    }
    
    return columnsRef.current;
};