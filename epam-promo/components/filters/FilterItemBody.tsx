import React from "react";
import { FilterToolbarItemTogglerProps } from "./FilterToolbarItemToggler";
import { IEditable, TableFiltersConfig, useForceUpdate } from "@epam/uui-core";

type IFilterItemBodyProps = FilterToolbarItemTogglerProps & TableFiltersConfig<any> & IEditable<any>;
export const LOADING = 'loading-placeholder';

const FilterItemBody = (props: IFilterItemBodyProps) => {
    const getStringResult = (prefix: string, value: string | undefined | null) => ({
        prefix: value ? prefix : "",
        selected: value ? value.includes(LOADING) ? LOADING : value : "",
    });
    const forceUpdate = useForceUpdate();

    switch (props.type) {
        case "multiPicker": {
            const prefix = "is:";
            const view = props.dataSource.getView({}, forceUpdate);
            const selected = props.value?.[props.field]?.map((i: any) => {
                const item = view.getById(i, null);
                return item.isLoading ? LOADING : (props.getName ? props.getName(item) : item.value.name);
            }).join(', ');
            return getStringResult(prefix, selected);
        }
        case "singlePicker": {
            const prefix = "is:";
            const view = props.dataSource.getView({}, forceUpdate);
            const item = props.value?.[props.field] && view.getById(props.value?.[props.field], null);
            if (!item) {
                return getStringResult(prefix, null);
            }
            const selected = item.isLoading ? LOADING : (props.getName ? props.getName(item) : item.value.name);
            return getStringResult(prefix, selected);
        }
        case "datePicker": {
            const prefix = "on:";
            const selected = props.value?.[props.field];
            return getStringResult(prefix, selected);
        }
        case "rangeDatePicker": {
            const prefix = "on:";
            if (!props.value?.[props.field] || !props.value?.[props.field]?.from || !props.value?.[props.field]?.to) {
                return getStringResult(prefix, null);
            }
            const selected = `${ props.value?.[props.field]?.from } - ${ props.value?.[props.field]?.to }`;
            return getStringResult(prefix, selected);
        }
    }
};

export default FilterItemBody;