import React, { useCallback, useMemo } from 'react';
import { DataColumnProps, ILens, TableFiltersConfig, IDropdownBodyProps } from '@epam/uui-core';
import { FilterColumnBody } from '../components/filters/FilterColumnBody';
import { normalizeFilterWithPredicates } from '../components/filters/helpers/predicateHelpers';

export const useColumnsWithFilters = <TFilter extends Record<string, any>>(initialColumns: DataColumnProps[], filters: TableFiltersConfig<TFilter>[] | undefined) => {
    const makeFilterRenderCallback = useCallback<(key: string) => (lens: ILens<TFilter>, dropdownProps: IDropdownBodyProps) => React.ReactNode>
        ((key) => function (filterLens, dropdownProps) {
            const filter = filters?.find((f) => f.columnKey === key);
            if (!filter) return null;

            const props = filterLens
                .onChange((oldFilter: TFilter, newFilter: TFilter) => normalizeFilterWithPredicates(newFilter) as TFilter)
                .prop(filter.field)
                .toProps();

            return <FilterColumnBody { ...props } { ...filter } { ...dropdownProps } />;
        }, [filters]);

    const columns = useMemo(() => {
        if (filters) {
            const filterKeys = filters.map((f) => f.columnKey);
            const newColumns = (initialColumns.map((column) => {
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
