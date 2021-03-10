import React from "react";
import css from "./Panel.scss";
import { IDataSource } from "@epam/uui";

import { Grouping } from "./Grouping";
import { Presets } from "./Presets";
import { Columns } from "./Columns";
import { Filters } from "./Filters";

interface ITableFilter<> {
    title: string;
    key: string;
    field: string;
    type: 'single' | 'multi';
    dataSource: IDataSource<any, any, any>;
}

interface IPanelProps {
    isOpened: boolean;
    filters: ITableFilter[];
}

const Panel: React.FC<IPanelProps> = ({ isOpened }) => {
    if (!isOpened) return null;

    return (
        <div className={ css.container }>
            <Presets/>
            <Filters/>
            <Columns/>
            <Grouping/>
        </div>
    );
};

export default React.memo(Panel);