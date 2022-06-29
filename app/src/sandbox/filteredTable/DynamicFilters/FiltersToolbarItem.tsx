import React, { useCallback, useState } from "react";
import css from "./DynamicFilters.scss";
import { Button, ControlGroup, FlexRow } from "@epam/promo";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { FilterPickerBody } from './FilterPickerBody';
import { FilterDataPickerBody } from './FilterDataPickerBody';
import { FilterRangeDatePickerBody } from './FilterRangeDatePickerBody';
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";

type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const forceUpdate = useForceUpdate();

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

    const renderConditions = () => {
        return (
            <ControlGroup>
                <Button
                    caption="is"
                    onClick={ () => null }/>
                <Button
                    caption="is not"
                    fill={ "white" }
                    onClick={ () => null }/>
            </ControlGroup>
        );
    };

    const removeOnclickHandler = () => {
        props.removeFilter(props.columnKey);
    };

    const renderHeader = () => {
        return (
            <FlexRow cx={ css.header } background={ "white" }>
                <div>
                    { /*{ renderConditions() }*/ }
                    <span className={ css.headerTitle }>{ props.title }</span>
                </div>
                <Button
                    size={ '24' }
                    cx={ css.removeBtn }
                    caption="Remove"
                    fill="light"
                    onClick={ removeOnclickHandler }
                    isDisabled={ props?.isAlwaysVisible }
                />
            </FlexRow>
        );
    };

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        return (
            <div>
                { renderHeader() }
                { getBody(dropdownProps) }
            </div>
        );
    };

    const getTogglerValue = () => {
        switch (props.type) {
            case "multiPicker": {
                const prefix = "is";
                const view = props.dataSource.getView({}, forceUpdate);
                const selected = props.value?.[props.field]?.map((i: any) => {
                    const item = view.getById(i, null);
                    return item.isLoading ? 'loading-placeholder' : (props.getName ? props.getName(item) : item.value.name);
                }).join(', ');
                return { prefix, selected };
            }
            case "singlePicker": {
                const prefix = "is";
                const view = props.dataSource.getView({}, forceUpdate);
                const item = props.value?.[props.field] && view.getById(props.value?.[props.field], null);
                if (!item) {
                    return null;
                }
                const selected = item.isLoading ? 'loading-placeholder' : (props.getName ? props.getName(item) : item.value.name);
                return { prefix, selected };
            }
            case "datePicker": {
                const prefix = "on";
                const selected = props.value?.[props.field];
                return { prefix, selected };
            }
            case "rangeDatePicker": {
                if (!props.value?.[props.field]) {
                    return null;
                }
                const prefix = "on";
                const selected = `${props.value?.[props.field]?.from || ''} - ${props.value?.[props.field]?.to || ''}`;
                return { prefix, selected };
            }
        }
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => {
        return (
            <FilterToolbarItemToggler
                { ...dropdownProps }
                value={ getTogglerValue() }
                title={ props.title }
                // width={ '250' }
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
            isDisabled={ false }
        />
    );
};

export const FiltersToolbarItem = React.memo(FiltersToolbarItemImpl);