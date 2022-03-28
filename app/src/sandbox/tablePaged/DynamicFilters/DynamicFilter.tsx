import React from "react";
import { FilterPicker } from "../../../helpers";
import { FilterConfig, IEditable } from "@epam/uui-core";

interface DynamicFilterProps<TFilter extends Record<string, any>> extends IEditable<TFilter> {
    filterConfig: FilterConfig<TFilter> | undefined;
}

const DynamicFilterImpl = <TFilter extends Record<string, any>>(props: DynamicFilterProps<TFilter>) => {
    return <FilterPicker { ...props } isDropdownNeeded/>;
};

export const DynamicFilter = React.memo(DynamicFilterImpl);