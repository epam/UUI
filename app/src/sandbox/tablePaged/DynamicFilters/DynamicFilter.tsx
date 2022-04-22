import React, { useCallback } from "react";
import css from "./DynamicFilters.scss";
import { FilterConfig, IEditable } from "@epam/uui-core";
import { DatePicker, FlexRow, PickerInput, RangeDatePicker } from "@epam/promo";
import { RangeDatePickerValue } from "@epam/uui-components";

type DynamicFilterProps<TFilter extends Record<string, any>> = FilterConfig<TFilter> & IEditable<TFilter>;

const DynamicFilterImpl = (props: DynamicFilterProps<any>) => {
    const handleChange = useCallback((value: any) => {
        props.onValueChange({ [props.field]: value });
    }, [props.field, props.onValueChange]);

    const renderPicker = () => {
        switch (props.type) {
            case "singlePicker":
                return (
                    <PickerInput
                        dataSource={ props.dataSource }
                        selectionMode="single"
                        value={ props.value?.[props.field] }
                        onValueChange={ handleChange }
                        valueType="id"
                        prefix={ props.title }
                    />
                );
            case "multiPicker":
                return (
                    <PickerInput
                        dataSource={ props.dataSource }
                        selectionMode="multi"
                        value={ props.value?.[props.field] }
                        onValueChange={ handleChange }
                        valueType="id"
                        prefix={ props.title }
                    />
                );
            case "datePicker":
                return (
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={ props.value?.[props.field] as string }
                        onValueChange={ handleChange }
                    />
                );
            case "rangeDatePicker":
                return (
                    <RangeDatePicker
                        value={ props.value?.[props.field] as RangeDatePickerValue }
                        onValueChange={ handleChange }
                    />
                );
        }
    };

    return (
        <div className={ css.cell }>
            { renderPicker() }
        </div>
    );
};

export const DynamicFilter = React.memo(DynamicFilterImpl);