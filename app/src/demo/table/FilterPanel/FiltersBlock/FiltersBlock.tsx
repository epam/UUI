import React, { useCallback } from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { IEditable } from "@epam/uui";
import { ITableFilter, ITableStateApi, PersonsTableState } from "../../types";

interface IFiltersProps  {
    tableStateApi: ITableStateApi;
    filters: ITableFilter[];
}

const FiltersBlockComponent: React.FC<IFiltersProps> = ({ tableStateApi, filters }) => {
    const handleChange = useCallback((newFilter: { [key: string]: any[] }) => {
        tableStateApi.onFilterChange({
            ...tableStateApi.filter,
            ...newFilter,
        });
    }, [tableStateApi.filter]);
    
    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { filters.map(filter => {
                return (
                    <Filter
                        { ...filter }
                        value={ tableStateApi.filter }
                        onValueChange={ handleChange }
                        key={ filter.id }
                    />
                );
            }) }
        </Accordion>
    );
};

export const FiltersBlock = React.memo(FiltersBlockComponent);