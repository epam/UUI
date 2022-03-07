import React, { useCallback, useState } from "react";
import css from "./Filter.scss";
import { IEditable, FilterConfig } from '@epam/uui-core';
import { DatePicker, IconContainer, PickerList, RangeDatePicker } from "@epam/promo";
import { RangeDatePickerValue } from "@epam/uui-components";
import { ReactComponent as ArrowDown } from "@epam/assets/icons/common/navigation-chevron-down-18.svg";

type IFilterProps<TFilter extends Record<string, any>> = FilterConfig<TFilter> & IEditable<TFilter | undefined>;

const FilterImpl = <TFilter extends Record<string, any>>(props: IFilterProps<TFilter>) => {
    const { field, value, onValueChange, title } = props;
    const [isOpened, setIsOpened] = useState(false);

    const handleChange = useCallback((value: TFilter[keyof TFilter]) => {
        onValueChange({ [field]: value } as TFilter);
    }, [field, onValueChange]);
    
    const toggle = () => setIsOpened(!isOpened);

    const renderPicker = () => {
        switch (props.type) {
            case "singlePicker":
                return (
                    <PickerList
                        dataSource={ props.dataSource }
                        selectionMode="single"
                        value={ value?.[field] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case "multiPicker":
                return (
                    <PickerList
                        dataSource={ props.dataSource }
                        selectionMode="multi"
                        value={ value?.[field] as TFilter[] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case "datePicker":
                return (
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={ value?.[field] as string }
                        onValueChange={ handleChange as (v: TFilter[keyof TFilter]) => void }
                    />
                );
            case "rangeDatePicker":
                return (
                    <RangeDatePicker
                        value={ value?.[field] as RangeDatePickerValue }
                        onValueChange={ handleChange as (v: RangeDatePickerValue) => void }
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

export const Filter = React.memo(FilterImpl) as typeof FilterImpl;