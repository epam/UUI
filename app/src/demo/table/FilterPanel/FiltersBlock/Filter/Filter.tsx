import React, { useCallback, useState } from "react";
import css from "./Filter.scss";
import { IconContainer, PickerList } from "@epam/promo";
import { IEditable } from "@epam/uui";
import arrowDown from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { ITableFilter } from "../../../types";

interface IFilterProps<T> extends ITableFilter, IEditable<{[key: string]: T[]} | undefined> {
    
}

const FilterComponent = <T extends unknown>(props: IFilterProps<T>) => {
    const {id, value, onValueChange, title, dataSource, selectionMode} = props;
    const [isOpened, setIsOpened] = useState(false);

    const handleChange = useCallback((value: T[]) => {
        onValueChange({[id]: value});
    }, [id, onValueChange]);

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
                        value={ value?.[id] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                </div>
            ) }
        </div>
    );
};

export const Filter = React.memo(FilterComponent) as typeof FilterComponent;