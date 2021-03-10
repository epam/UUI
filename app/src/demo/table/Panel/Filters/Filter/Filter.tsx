import React, { useMemo, useState } from "react";
import css from "./Filter.scss";
import { CheckboxGroup, IconContainer } from "@epam/promo";
import arrowDown from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { columns } from "../../../data";

const Filter: React.FC<typeof columns[number]> = ({ name }) => {
    const [isOpened, setIsOpened] = useState(false);
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

    const toggle = () => setIsOpened(!isOpened);

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{ name }</div>
                <IconContainer icon={ arrowDown } flipY={ isOpened }/>
            </div>

            { isOpened && (
                <div>
                    <CheckboxGroup items={ items } value={ value } onValueChange={ setValue }/>
                </div>
            ) }
        </div>
    );
};

export default React.memo(Filter);