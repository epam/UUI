import React, { useMemo, useState } from "react";
import css from "./Filter.scss";
import { CheckboxGroup, IconContainer } from "@epam/promo";
import arrowDown from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { ITableFilter } from "../../../types";
import { PickerList } from "../../../../../../../loveship";

const Filter: React.FC<ITableFilter> = ({ title, dataSource, selectionMode }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [value, setValue] = useState(null);

    const toggle = () => setIsOpened(!isOpened);

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{ title }</div>
                <IconContainer icon={ arrowDown } flipY={ isOpened }/>
            </div>

            { isOpened && (
                <div>
                    <PickerList
                        dataSource={ dataSource } 
                        selectionMode={ selectionMode } 
                        value={ value } 
                        onValueChange={ setValue }
                        valueType="id" 
                    />
                </div>
            ) }
        </div>
    );
};

export default React.memo(Filter);