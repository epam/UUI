import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { DataQueryFilter, normalizeDataQueryFilter } from "@epam/uui";
import { ITableFilter, PersonsTableState } from "../../types";

interface IFiltersProps {
    filters: ITableFilter[];
    value: PersonsTableState;
    onValueChange: (newState: PersonsTableState) => void;
}

const Filters: React.FC<IFiltersProps> = ({ filters, value, onValueChange }) => {
    const handleChange = useCallback((filter: DataQueryFilter<any>) => {
        onValueChange({
            ...value,
            filter: normalizeDataQueryFilter({
                ...value.filter,
                ...filter,
            }),
        });
    }, [value, onValueChange]);

    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { filters.map(filter => {
                return (
                    <Filter
                        { ...filter }
                        id={ filter.key }
                        onValueChange={ handleChange }
                    />
                );
            }) }
        </Accordion>
    );
};

export default React.memo(Filters);