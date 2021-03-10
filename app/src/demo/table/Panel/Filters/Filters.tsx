import React from "react";
import { columns } from "../../data";
import { Filter } from "./Filter";

const Filters: React.FC = () => {
    return <>
        { columns.map(item => {
            return <Filter { ...item }/>;
        }) }
    </>;
};

export default React.memo(Filters);