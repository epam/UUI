import React, { useCallback } from "react";
import { DatePicker, PickerInput, PickerList, RangeDatePicker } from "@epam/promo";
import { RangeDatePickerValue } from "@epam/uui-components";
import { FilterConfig, IEditable } from "@epam/uui-core";

export interface FilterPickerProps<TFilter extends Record<string, any>> extends IEditable<TFilter> {
    filterConfig: FilterConfig<TFilter> | undefined;
    isDropdownNeeded: boolean;
}

const FilterPickerImpl = <TFilter extends Record<string, any>>(props: FilterPickerProps<TFilter>) => {
    const { value, filterConfig, onValueChange } = props;

    const handleChange = useCallback((value: TFilter[keyof TFilter]) => {
        onValueChange({ [filterConfig.field]: value } as TFilter);
    }, [filterConfig.field, onValueChange]);
    
    const Picker = props.isDropdownNeeded ? PickerInput : PickerList as any;

    switch (filterConfig.type) {
        case "singlePicker":
            return (
                <Picker
                    dataSource={ filterConfig.dataSource }
                    selectionMode="single"
                    value={ value?.[filterConfig.field] }
                    onValueChange={ handleChange }
                    valueType="id"
                />
            );
        case "multiPicker":
            return (
                <Picker
                    dataSource={ filterConfig.dataSource }
                    selectionMode="multi"
                    value={ value?.[filterConfig.field] as TFilter[] }
                    onValueChange={ handleChange }
                    valueType="id"
                />
            );
        case "datePicker":
            return (
                <DatePicker
                    format="DD/MM/YYYY"
                    value={ value?.[filterConfig.field] as string }
                    onValueChange={ handleChange }
                />
            );
        case "rangeDatePicker":
            return (
                <RangeDatePicker
                    value={ value?.[filterConfig.field] as RangeDatePickerValue }
                    onValueChange={ handleChange }
                />
            );
    }
};

export const FilterPicker = React.memo(FilterPickerImpl) as typeof FilterPickerImpl;