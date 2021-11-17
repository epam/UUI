import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { ITableFilter } from "../../types";

interface IFiltersProps {
    filter: Record<string, any>;
    onFilterChange(newFilter: Record<string, any>): void;
    filters: ITableFilter[];
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
                        key={ f.id }
                    />
                );
            }) }
        </Accordion>
    );
};

export const FiltersBlock = React.memo(FiltersBlockComponent);