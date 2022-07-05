import React, { useCallback, useState } from "react";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile } from "@epam/uui-core";
import { FilterPickerBody } from './FilterPickerBody';
import { FilterDataPickerBody } from './FilterDataPickerBody';
import { FilterRangeDatePickerBody } from './FilterRangeDatePickerBody';
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { FlexRow, Panel } from "../layout";
import FilterItemBody from "./FilterItemBody";
import { LinkButton } from "../buttons";

type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);

    const handleChange = useCallback((value: any) => {
        props.onValueChange({ [props.field]: value });
    }, [props.field, props.onValueChange]);

    const getBody = (dropdownProps: DropdownBodyProps) => {
        switch (props.type) {
            case "singlePicker":
                return (
                    <FilterPickerBody
                        { ...dropdownProps }
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
                    <FilterPickerBody
                        { ...dropdownProps }
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
                    <FilterDataPickerBody
                        format="DD/MM/YYYY"
                        value={ props.value?.[props.field] }
                        onValueChange={ handleChange }
                    />
                );
            case "rangeDatePicker":
                return (
                    <FilterRangeDatePickerBody
                        value={ props.value?.[props.field] || { from: null, to: null } }
                        onValueChange={ handleChange }
                    />
                );
        }
    };

    const removeOnclickHandler = () => {
        props.removeFilter(props.columnKey);
    };

    const renderHeader = () => {
        return (
            <FlexRow cx={ css.header }>
                <div>
                    <span className={ css.headerTitle }>{ props.title }</span>
                </div>
                { !props?.isAlwaysVisible && <LinkButton caption="Remove" onClick={ removeOnclickHandler } size="24"/> }
            </FlexRow>
        );
    };

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        return (
            <Panel shadow background="white">
                { renderHeader() }
                { getBody(dropdownProps) }
            </Panel>
        );
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => {
        return (
            <FilterToolbarItemToggler
                { ...dropdownProps }
                value={ FilterItemBody(props) }
                title={ props.title }
            />
        );
    };

    return (
        <Dropdown
            renderTarget={ renderTarget }
            renderBody={ renderBody }
            closeBodyOnTogglerHidden={ !isMobile() }
            value={ isOpen }
            onValueChange={ isOpenChange }
        />
    );
};

export const FiltersToolbarItem = React.memo(FiltersToolbarItemImpl);