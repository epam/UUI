import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { FilterConfig } from "@epam/uui-core";

interface IFiltersProps<TFilter extends Record<string, any>> {
    filter: TFilter;
    onFilterChange(newFilter: TFilter): void;
    filters: FilterConfig<TFilter>[];
}

const FiltersBlockImpl = <TFilter extends Record<string, any>>(props: IFiltersProps<TFilter>) => {
    const { onFilterChange, filter, filters } = props;
    
    const handleChange = useCallback((newFilter: TFilter) => {
        onFilterChange({
            ...filter,
            ...newFilter,
        });
    }, [filter]);
    
    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { filters.map(f => {
                return (
                    <Filter
                        { ...f }
                        value={ filter }
                        onValueChange={ handleChange }
                        columnKey={ f.columnKey }
                    />
                );
            }) }
        </Accordion>
    );
};

export const FiltersBlock = React.memo(FiltersBlockImpl) as typeof FiltersBlockImpl;