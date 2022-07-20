import React, { useCallback, useState } from "react";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { FlexRow, Panel } from "../layout";
import { LinkButton } from "../buttons";
import { Text, TextPlaceholder } from "../typography";
import { FilterItemBody } from "./FilterItemBody";
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/action-deleteforever-12.svg';

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const forceUpdate = useForceUpdate();

    const onValueChange = useCallback((value: any) => {
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
            { <FilterItemBody { ...props } { ...dropdownProps } onValueChange={ onValueChange }/> }
        </Panel>
    );

    const getTogglerValue = () => {
        const currentValue = props.value;

        switch (props.type) {
            case "multiPicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                let postfix = currentValue?.length > 2 ? ` +${ (currentValue.length - 2).toString() } items` : null;
                let isLoading = false;

                const selection = currentValue ? currentValue?.slice(0, 2).map((i: any) => {
                    const item = view.getById(i, null);
                    isLoading = item.isLoading;
                    return item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                }) : ['All'];

                const selectionText = isLoading ? selection : selection.join(', ');
                return { selection: selectionText, postfix };
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                const item = currentValue && view.getById(currentValue, null);
                if (!item) {
                    return { selection: 'All' };
                }
                const selection = item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                return { selection };
            }
            case "datePicker": {
                return { selection: currentValue ?? "Select date" };
            }
            case "rangeDatePicker": {
                if (!currentValue || (!currentValue.from && !currentValue.to)) {
                    return { selection: "Select period" };
                }

                const selection = `${ currentValue?.from ?? 'Select From' } - ${ currentValue?.to ?? 'Select To' }`;
                return { selection };
            }
        }
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => (
        <FilterToolbarItemToggler
            { ...dropdownProps }
            { ...getTogglerValue() }
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