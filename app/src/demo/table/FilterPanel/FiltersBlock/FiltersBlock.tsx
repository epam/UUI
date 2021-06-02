import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { IEditable } from "@epam/uui";
import { ITableFilter, PersonsTableState } from "../../types";

interface IFiltersProps extends IEditable<PersonsTableState> {
    filters: ITableFilter[];
}

const FiltersBlockComponent: React.FC<IFiltersProps> = ({ filters, value, onValueChange }) => {
    const handleChange = useCallback((filter: { [key: string]: any[] }) => {
        onValueChange({
            ...value,
            filter: {
                ...value.filter,
                ...filter,
            },
        });
    }, [value, onValueChange]);
    
    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { filters.map(filter => {
                return (
                    <Filter
                        { ...filter }
                        value={ value.filter }
                        onValueChange={ handleChange }
                        key={ filter.id }
                    />
                );
            }) }
        </Accordion>
    );
};

export const FiltersBlock = React.memo(FiltersBlockComponent);