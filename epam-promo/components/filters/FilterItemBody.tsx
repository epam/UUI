import React from "react";
import { FilterPickerBody } from "./FilterPickerBody";
import { FilterDataPickerBody } from "./FilterDataPickerBody";
import { FilterRangeDatePickerBody } from "./FilterRangeDatePickerBody";
import { IFilterItemBodyProps } from "@epam/uui-core";

const FilterItemBody = (props: IFilterItemBodyProps<any>) => {
    const { onValueChange, dropdownProps, dataSource, value, title, type } = props;

    switch (type) {
        case "singlePicker":
            return (
                <FilterPickerBody
                    { ...dropdownProps }
                    dataSource={ dataSource }
                    selectionMode="single"
                    value={ value }
                    onValueChange={ onValueChange }
                    valueType="id"
                    prefix={ title }
                />
            );
        case "multiPicker":
            return (
                <FilterPickerBody
                    { ...dropdownProps }
                    dataSource={ dataSource }
                    selectionMode="multi"
                    value={ value }
                    onValueChange={ onValueChange }
                    valueType="id"
                    prefix={ title }
                />
            );
        case "datePicker":
            return (
                <FilterDataPickerBody
                    format="DD/MM/YYYY"
                    value={ value }
                    onValueChange={ onValueChange }
                />
            );
        case "rangeDatePicker":
            return (
                <FilterRangeDatePickerBody
                    value={ value || { from: null, to: null } }
                    onValueChange={ onValueChange }
                />
            );
    }
};

export default FilterItemBody;