import React, { useCallback, useState } from "react";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { FlexRow, Panel } from "../layout";
import { LinkButton } from "../buttons";
import { Text } from "../typography";
import FilterItemBody from "./FilterItemBody";

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

export const LOADING = 'loading-placeholder';

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);

    const handleChange = useCallback((value: any) => {
        props.onValueChange({ [props.field]: value });
    }, [props.field, props.onValueChange]);

    const removeOnclickHandler = () => {
        props.removeFilter(props.columnKey);
    };

    const renderHeader = () => (
        <FlexRow cx={ css.header }>
            <Text color="gray60" fontSize="12">{ props.title }</Text>
            { !props?.isAlwaysVisible && <LinkButton caption="Remove" onClick={ removeOnclickHandler } size="24"/> }
        </FlexRow>
    );

    const renderBody = (dropdownProps: DropdownBodyProps) => (
        <Panel shadow background="white">
            { renderHeader() }
            { FilterItemBody({ sourceProps: props, handleChange, dropdownProps }) }
        </Panel>
    );

    const getTogglerValue = () => {
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

    const renderTarget = (dropdownProps: IDropdownToggler) => (
        <FilterToolbarItemToggler
            { ...dropdownProps }
            value={ getTogglerValue() }
            title={ props.title }
        />
    );

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