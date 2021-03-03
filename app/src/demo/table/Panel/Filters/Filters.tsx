import React, {useMemo, useState} from "react";
import css from "./Filters.scss";
import {columns} from "../../data";
import {Accordion, CheckboxGroup} from "@epam/promo";

const Filters: React.FC = () => {
    return <>
        { columns.map(item => {
            const [value, setValue] = useState(null);
            const items = useMemo(() => ([
                {
                    id: 1,
                    name: "Item 1",
                },
                {
                    id: 2,
                    name: "Item 2",
                },
                {
                    id: 3,
                    name: "Item 3",
                },
            ]), []);

            return (
                <Accordion title={ item.name } mode="inline" cx={ [css.accordion] } key={ item.id }>
                    <CheckboxGroup items={ items } value={ value } onValueChange={ setValue }/>
                </Accordion>
            );
        }) }
    </>;
};

export default React.memo(Filters);