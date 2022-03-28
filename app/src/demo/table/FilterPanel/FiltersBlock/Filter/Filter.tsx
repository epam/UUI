import React, { useState } from "react";
import css from "./Filter.scss";
import { IconContainer } from "@epam/promo";
import { FilterConfig, IEditable } from "@epam/uui-core";
import { ReactComponent as ArrowDown } from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { FilterPicker } from "../../../../../helpers";

interface IFilterProps<TFilter extends Record<string, any>> extends IEditable<TFilter> {
    filterConfig: FilterConfig<TFilter> | undefined;
}

const FilterImpl = <TFilter extends Record<string, any>>(props: IFilterProps<TFilter>) => {
    const [isOpened, setIsOpened] = useState(false);

    const toggle = () => setIsOpened(!isOpened);

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{ props.filterConfig.title }</div>
                <IconContainer icon={ ArrowDown } flipY={ isOpened }/>
            </div>

            { isOpened && (
                <div>
                    <FilterPicker { ...props } isDropdownNeeded={ false }/>
                </div>
            ) }
        </div>
    );
};

export const Filter = React.memo(FilterImpl) as typeof FilterImpl;