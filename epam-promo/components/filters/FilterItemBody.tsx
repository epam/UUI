import React from "react";
import { DropdownBodyProps } from "@epam/uui-components";
import { FilterPickerBody } from "./FilterPickerBody";
import { FilterDataPickerBody } from "./FilterDataPickerBody";
import { FilterRangeDatePickerBody } from "./FilterRangeDatePickerBody";
import { FiltersToolbarItemProps } from "./FiltersToolbarItem";

interface IFilterItemBodyProps {
    sourceProps: FiltersToolbarItemProps;
    handleChange: (value: any) => void;
    dropdownProps: DropdownBodyProps;
}

const FilterItemBody = ({ sourceProps, handleChange, dropdownProps }: IFilterItemBodyProps) => {
    switch (sourceProps.type) {
        case "singlePicker":
            return (
                <FilterPickerBody
                    { ...dropdownProps }
                    dataSource={ sourceProps.dataSource }
                    selectionMode="single"
                    value={ sourceProps.value?.[sourceProps.field] }
                    onValueChange={ handleChange }
                    valueType="id"
                    prefix={ sourceProps.title }
                />
            );
        case "multiPicker":
            return (
                <FilterPickerBody
                    { ...dropdownProps }
                    dataSource={ sourceProps.dataSource }
                    selectionMode="multi"
                    value={ sourceProps.value?.[sourceProps.field] }
                    onValueChange={ handleChange }
                    valueType="id"
                    prefix={ sourceProps.title }
                />
            );
        case "datePicker":
            return (
                <FilterDataPickerBody
                    format="DD/MM/YYYY"
                    value={ sourceProps.value?.[sourceProps.field] }
                    onValueChange={ handleChange }
                />
            );
        case "rangeDatePicker":
            return (
                <FilterRangeDatePickerBody
                    value={ sourceProps.value?.[sourceProps.field] || { from: null, to: null } }
                    onValueChange={ handleChange }
                />
            );
    }
};

export default FilterItemBody;