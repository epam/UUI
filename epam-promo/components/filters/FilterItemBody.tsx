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

const FilterItemBody = (props: IFilterItemBodyProps) => {
    const { sourceProps, handleChange, dropdownProps } = props;
    const value = sourceProps.value?.[sourceProps.field];

    switch (sourceProps.type) {
        case "singlePicker":
            return (
                <FilterPickerBody
                    { ...props }
                    { ...dropdownProps }
                    dataSource={ sourceProps.dataSource }
                    selectionMode="single"
                    value={ value }
                    onValueChange={ handleChange }
                    valueType="id"
                    prefix={ sourceProps.title }
                />
            );
        case "multiPicker":
            return (
                <FilterPickerBody
                    { ...props }
                    { ...dropdownProps }
                    dataSource={ sourceProps.dataSource }
                    selectionMode="multi"
                    value={ value }
                    onValueChange={ handleChange }
                    valueType="id"
                    prefix={ sourceProps.title }
                />
            );
        case "datePicker":
            return (
                <FilterDataPickerBody
                    format="DD/MM/YYYY"
                    value={ value }
                    onValueChange={ handleChange }
                />
            );
        case "rangeDatePicker":
            return (
                <FilterRangeDatePickerBody
                    value={ value || { from: null, to: null } }
                    onValueChange={ handleChange }
                />
            );
    }
};

export default FilterItemBody;