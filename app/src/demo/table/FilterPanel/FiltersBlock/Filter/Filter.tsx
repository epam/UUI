import React, { useCallback, useState } from "react";
import css from "./Filter.scss";
import { DatePicker, IconContainer, PickerList, RangeDatePicker } from "@epam/promo";
import { IEditable } from "@epam/uui";
import { ReactComponent as ArrowDown } from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { ITableFilter } from "../../../types";

interface IFilterProps<T> extends ITableFilter, IEditable<{ [key: string]: (T | T[]) } | undefined> {

}

const FilterComponent = <T extends unknown>(props: IFilterProps<T>) => {
    const { id, value, onValueChange, title, dataSource, type } = props;
    const [isOpened, setIsOpened] = useState(false);

    const handleChange = useCallback((value: (T | T[])) => {
        onValueChange({ [id]: value });
    }, [id, onValueChange]);

    const toggle = () => setIsOpened(!isOpened);

    const renderPicker = () => {
        switch (type) {
            case "singlePicker":
                return (
                    <PickerList
                        dataSource={ dataSource }
                        selectionMode="single"
                        value={ value?.[id] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case "multiPicker":
                return (
                    <PickerList
                        dataSource={ dataSource }
                        selectionMode="multi"
                        value={ value?.[id] as T[] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case "datePicker":
                return (
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={ value?.[id] as string }
                        onValueChange={ handleChange as (v: string) => void }
                    />
                );
            case "rangeDatePicker":
                return (
                    <RangeDatePicker
                        value={ value?.[id] as any }
                        onValueChange={ handleChange as any }
                    />
                );
        }
    };

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{ title }</div>
                <IconContainer icon={ ArrowDown } flipY={ isOpened }/>
            </div>

            { isOpened && (
                <div>
                    { renderPicker() }
                </div>
            ) }
        </div>
    );
};

export const Filter = React.memo(FilterComponent) as typeof FilterComponent;