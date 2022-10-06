import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataColumnProps, ILens, TableFiltersConfig, useUuiContext } from "@epam/uui-core";
import { DropdownBodyProps } from "../overlays";

export const useColumnsWithFilters = <TFilter extends Record<string, any>>(initialColumns: DataColumnProps[], filters: TableFiltersConfig<TFilter>[] | undefined) => {
    const context = useUuiContext();

    const makeFilterRenderCallback = useCallback<(key: string) => (lens: ILens<TFilter>, dropdownProps: DropdownBodyProps) => React.ReactNode>
    ((key) => (filterLens, dropdownProps) => {
        const filter = filters.find(f => f.columnKey === key);
        if (!filter) return null;

        const props = filterLens.prop(filter.field).toProps();
        return context.uuiSkin.skin.FilterItemBody.render({
            ...props,
            ...filter,
            ...dropdownProps,
        });
    }, [filters]);

    const columns = useMemo(() => {
        if (filters) {
            const filterKeys = filters.map(f => f.columnKey);
            const newColumns = (initialColumns.map(column => {
                if (filterKeys.includes(column.key)) {
                    return {
                        ...column,
                        renderFilter: makeFilterRenderCallback(column.key),
                    };
                } else {
                    return column;
                }
            }));
            return newColumns;
        }
        return initialColumns;
    }, [filters, initialColumns]);
    
    return columns;
};