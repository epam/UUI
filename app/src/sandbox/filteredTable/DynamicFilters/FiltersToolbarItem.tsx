import React, { useCallback, useState } from "react";
import css from "./DynamicFilters.scss";
import { PickerToggler, Button, FlexRow, ControlGroup } from "@epam/promo";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { FilterPickerBody } from './FilterPickerBody';
import { FilterDataPickerBody } from './FilterDataPickerBody';
import { FilterRangeDatePickerBody } from './FilterRangeDatePickerBody';
import { Dropdown, DropdownBodyProps, RangeDatePickerValue } from "@epam/uui-components";

type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const forceUpdate = useForceUpdate();

    // console.log('FiltersToolbarItemImpl', props);

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
        console.log('removeOnclickHandler', props.columnKey);
        props.removeFilter(props.columnKey);
    };

    const renderHeader = () => {
        return (
            <FlexRow cx={ css.header } background={ "white" }>
                <div>
                    { props.title }
                    { renderConditions() }
                </div>
                <Button
                    caption="REMOVE"
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
                const view = props.dataSource.getView({}, forceUpdate);
                return props.value?.[props.field]?.map((i: any) => {
                    const item = view.getById(i, null);
                    return item.isLoading ? 'loading-placeholder' : (props.getName ? props.getName(item) : item.value.name);
                }).join(', ');
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                const item = props.value?.[props.field] && view.getById(props.value?.[props.field], null);
                if (!item) {
                    return null;
                }
                return item.isLoading ? 'loading-placeholder' : (props.getName ? props.getName(item) : item.value.name);
            }
            case "datePicker": {
                return props.value?.[props.field];
            }
            case "rangeDatePicker": {
                if (!props.value?.[props.field]) {
                    return null;
                }
                return `${props.value?.[props.field]?.from || ''} - ${props.value?.[props.field]?.to || ''}`;
            }
        }
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => {
        return <PickerToggler
            { ...dropdownProps }
            pickerMode={ 'multi' }
            placeholder={ getTogglerValue() }
            onValueChange={ () => {} }
            searchPosition='none'
            getName={ (i: any) => {
                if (props.type === 'multiPicker' || props.type === 'singlePicker') {
                    return props.getName ? props.getName(i) : i.name;
                }
            } }
            prefix={ props.title }
        />;
    };

    return (
        <Dropdown
            renderTarget={ renderTarget }
            renderBody={ renderBody }
            closeBodyOnTogglerHidden={ !isMobile() }
            value={ isOpen }
            onValueChange={ (val) =>  { debugger; isOpenChange(val); } }
        />
    );
};

export const FiltersToolbarItem = React.memo(FiltersToolbarItemImpl);