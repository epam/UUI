import React from "react";
import { columns } from "../../data";
import { Filter } from "./Filter";
import { Accordion } from "@epam/promo";

const Filters: React.FC = () => {
    return (
        <Accordion title="Filters" mode="inline" padding="18">
            { columns.map(item => {
                return <Filter { ...item }/>;
            }) }
        </Accordion>
    );
};

export default React.memo(Filters);