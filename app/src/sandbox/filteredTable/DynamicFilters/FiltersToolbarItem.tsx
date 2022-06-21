import React, { useCallback, useState } from "react";
import css from "./DynamicFilters.scss";
import {
    TableFiltersConfig,
    IDropdownToggler,
    IEditable,
    isMobile,
    useForceUpdate,
    IDataSourceView, DataRowProps
} from "@epam/uui-core";
import { PickerToggler } from "@epam/promo";
import { FilterPickerBody } from './FilterPickerBody';
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";

type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
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
            // case "datePicker":
            //     return (
            //         <DatePicker
            //             format="DD/MM/YYYY"
            //             value={ props.value?.[props.field] as string }
            //             onValueChange={ handleChange }
            //         />
            //     );
            // case "rangeDatePicker":
            //     return (
            //         <RangeDatePicker
            //             value={ props.value?.[props.field] as RangeDatePickerValue }
            //             onValueChange={ handleChange }
            //         />
            //     );
        }
    };

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        return (
            <div>
                header
                { getBody(dropdownProps) }
            </div>
        );
    };

    const getSelection = () => {
        switch (props.type) {
            case "multiPicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                return props.value?.[props.field]?.map((i: any) => {
                    return view.getById(i, null);
                });
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                return props.value?.[props.field] && [view.getById(props.value?.[props.field], null)];
            }
        }
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => {
        return <PickerToggler
            { ...dropdownProps }
            pickerMode={ 'multi' }
            value={ null }
            onValueChange={ () => {} }
            searchPosition='none'
            selection={ getSelection() }
            getName={ (i: any) => {
                if (props.type === 'multiPicker' || props.type === 'singlePicker') {
                    return props.getName ? props.getName(i) : i.name;
                }
            } }
            placeholder={ props.title }
        />;
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