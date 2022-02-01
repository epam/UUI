import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { FilterConfig } from "../../types";

interface IFiltersProps {
    filter: Record<string, any>;
    onFilterChange(newFilter: Record<string, any>): void;
    filters: FilterConfig[];
}

const FiltersBlockComponent: React.FC<IFiltersProps> = ({ onFilterChange, filter, filters }) => {
    const handleChange = useCallback((newFilter: { [key: string]: any[] }) => {
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
                        columnKey={ f.field }
                    />
                );
            }) }
        </Accordion>
    );
};

export const FiltersBlock = React.memo(FiltersBlockComponent);