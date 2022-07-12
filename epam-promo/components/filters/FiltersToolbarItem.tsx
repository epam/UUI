import React, { useCallback, useState } from "react";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { FlexRow, Panel } from "../layout";
import { LinkButton } from "../buttons";
import { Text, TextPlaceholder } from "../typography";
import FilterItemBody from "./FilterItemBody";
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/action-deleteforever-12.svg';

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string) => void;
};

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
            { <FilterItemBody sourceProps={ props } handleChange={ handleChange } dropdownProps={ dropdownProps }/> }
        </Panel>
    );

    const getTogglerValue = (): { selection: string | null | JSX.Element, postfix: string | null | JSX.Element} => {
        const currentValue = props.value?.[props.field];

        switch (props.type) {
            case "multiPicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                let postfix = currentValue?.length > 2 ? <span className={ css.placeholder }>{ ` +${ (currentValue.length - 2).toString() } items` }</span> : null;

                const selection = currentValue?.slice(0, 2).map((i: any) => {
                    const item = view.getById(i, null);
                    return item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                });
                const selectionText = currentValue
                    ? typeof selection[0] === 'string'
                        ? currentValue.length > 1 ? selection.join(', ') : selection[0]
                        : currentValue.length > 1 ? <span className={ css.placeholder }>{ selection[0] },{ selection[1] }</span> : selection[0]
                    : 'All';
                return { selection: selectionText, postfix };
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                const item = currentValue && view.getById(currentValue, null);
                if (!item) {
                    return { selection: 'All', postfix: null };
                }
                const selection = item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                return { selection, postfix: null };
            }
            case "datePicker": {
                return { selection: currentValue ?? "Select date", postfix: null };
            }
            case "rangeDatePicker": {
                if (!currentValue) {
                    return { selection: "Select period", postfix: null };
                }
                const from = `${ currentValue?.from ?? 'Select From' }`;
                const to = `${ currentValue?.to ?? 'Select To' }`;
                const selection = from.includes('Select From') && to.includes('Select To') ? `Select period` : `${ from } - ${ to }`;
                return { selection, postfix: null };
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