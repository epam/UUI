import React, { useCallback, useState } from "react";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { FlexRow, Panel } from "../layout";
import { LinkButton } from "../buttons";
import { Text } from "../typography";
import FilterItemBody from "./FilterItemBody";
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/action-deleteforever-12.svg';

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

export const LOADING = 'loading-placeholder';

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const forceUpdate = useForceUpdate();

    const handleChange = useCallback((value: any) => {
        props.onValueChange({ [props.field]: value });
    }, [props.field, props.onValueChange]);

    const removeOnclickHandler = () => {
        props.removeFilter(props.columnKey);
    };

    const renderHeader = () => (
        <FlexRow cx={ css.header }>
            <Text color="gray60" fontSize="12">{ props.title }</Text>
            { !props?.isAlwaysVisible && <LinkButton cx={ css.removeButton } caption="REMOVE FILTER" onClick={ removeOnclickHandler } size="24" icon={ RemoveIcon }/> }
        </FlexRow>
    );

    const renderBody = (dropdownProps: DropdownBodyProps) => (
        <Panel shadow background="white">
            { renderHeader() }
            { <FilterItemBody  sourceProps={ props } handleChange={ handleChange } dropdownProps={ dropdownProps }/> }
        </Panel>
    );

    const getTogglerValue = () => {
        const getStringResult = (prefix: string, value: string | null, badgeText: string | null) => ({
            prefix,
            selected: value ? value.includes(LOADING) ? LOADING : value : null,
            badgeText,
        });

        switch (props.type) {
            case "multiPicker": {
                const prefix = "All";
                const view = props.dataSource.getView({}, forceUpdate);
                const selected = props.value?.[props.field]?.map((i: any) => {
                    const item = view.getById(i, null);
                    return item.isLoading ? LOADING : (props.getName ? props.getName(item) : item.value.name);
                }).join(', ');

                const selectedArray = selected?.split(',') ?? selected;
                if (selectedArray && selectedArray?.length && !selectedArray?.join(" ").includes(LOADING)) {
                    const selectedText = selectedArray.length > 1 ? [selectedArray[0], selectedArray[1]].join(', ') : selectedArray[0];
                    const badgeText = selectedArray.length > 2 ? ` +${(selectedArray.length - 2).toString()} items` : null;
                    return getStringResult(prefix, selectedText, badgeText);
                }
                return getStringResult(prefix, selected, null);
            }
            case "singlePicker": {
                const prefix = "All";
                const view = props.dataSource.getView({}, forceUpdate);
                const item = props.value?.[props.field] && view.getById(props.value?.[props.field], null);
                if (!item) {
                    return getStringResult(prefix, null, null);
                }
                const selected = item.isLoading ? LOADING : (props.getName ? props.getName(item) : item.value.name);
                return getStringResult(prefix, selected, null);
            }
            case "datePicker": {
                const prefix = "Select date";
                const selected = props.value?.[props.field];
                return getStringResult(prefix, selected, null);
            }
            case "rangeDatePicker": {
                const prefix = "Select date";
                if (!props.value?.[props.field]) {
                    return getStringResult(prefix, null, null);
                }
                const from = `${ props.value?.[props.field]?.from ?? 'not selected' }`;
                const to = `${ props.value?.[props.field]?.to ?? 'not selected' }`;
                const selected = from.includes('not selected') && to.includes('not selected') ? null : `${ from } - ${ to }`;
                return getStringResult(prefix, selected, null);
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