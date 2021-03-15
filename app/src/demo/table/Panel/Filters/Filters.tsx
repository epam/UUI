import React from "react";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";
import { ITableFilter } from "../../types";

interface IFiltersProps {
    filters: ITableFilter[];
}

const Filters: React.FC<IFiltersProps> = ({ filters }) => {
    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { filters.map(item => {
                return <Filter { ...item }/>;
            }) }
        </Accordion>
    );
};

export default React.memo(Filters);