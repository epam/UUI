import React from "react";
import { IFilterItemBodyProps } from "@epam/uui-core";
import { ColumnPickerFilter } from "../ColumnPickerFilter";
import { DatePicker, RangeDatePicker } from "../../datePickers";

export const FilterItemBody = (props: IFilterItemBodyProps<any>) => {
    switch (props.type) {
        case "singlePicker":
            return (
                <ColumnPickerFilter
                    { ...props }
                    selectionMode="single"
                    valueType="id"
                />
            );
        case "multiPicker":
            return (
                <ColumnPickerFilter
                    { ...props }
                    selectionMode="multi"
                    valueType="id"
                />
            );
        case "datePicker":
            return (
                <DatePicker
                    { ...props }
                    format="DD/MM/YYYY"
                />
            );
        case "rangeDatePicker":
            return (
                <RangeDatePicker
                    { ...props }
                />
            );
    }
};