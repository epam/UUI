import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import cx from "classnames";
import css from "./FiltersToolbarItem.scss";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate, FilterPredicateName } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { Panel } from "../layout";
import { LinkButton } from "../buttons";
import { MultiSwitch } from "../inputs";
import { Text, TextPlaceholder } from "../typography";
import { FilterItemBody } from "./FilterItemBody";
import { DropdownContainer } from "../overlays";
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/action-deleteforever-12.svg';

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string, field: any) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const getDefaultPredicate = () => {
        if (!props.predicates) {
            return null;
        }
        return Object.keys(props.value || {})[0] || props.predicates.find(i => i.isDefault)?.predicate || props.predicates?.[0].predicate;
    };

    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const [predicate, setPredicate] = useState(getDefaultPredicate());
    const forceUpdate = useForceUpdate();

    const onValueChange = useCallback((value: any) => {
        if (props.predicates) {
            props.onValueChange({ [props.field]: { [predicate]: value } });
        } else {
            props.onValueChange({ [props.field]: value });
        }
    }, [props.field, props.onValueChange]);

    const removeOnclickHandler = () => {
        props.removeFilter(props.columnKey, props.field);
    };

    const changePredicate = (val: FilterPredicateName) => {
        setPredicate(val);
        props.onValueChange({ [props.field]: { [val]: getValue() } });
    };

    const renderHeader = () => (
        <div className={ cx(css.header) }>
            {
                props.predicates ? <MultiSwitch
                    items={ props.predicates.map(i => ({id: i.predicate, caption: i.name})) }
                    value={ predicate }
                    onValueChange={ changePredicate }
                    size='24'
                /> : <Text color="gray60" fontSize="12">{ props.title }</Text>
            }
            { !props?.isAlwaysVisible && <LinkButton cx={ css.removeButton } caption="REMOVE FILTER" onClick={ removeOnclickHandler } size="24" icon={ RemoveIcon }/> }
        </div>
    );

    const renderBody = (dropdownProps: DropdownBodyProps) => (
        <DropdownContainer>
            <Panel background="white">
                { renderHeader() }
                { <FilterItemBody { ...props } { ...dropdownProps } value={ getValue() } onValueChange={ onValueChange }/> }
            </Panel>
        </DropdownContainer>
    );

    const getValue = () => {
        return predicate ? props.value?.[predicate] : props.value;
    };

    const getTogglerValue = () => {
        const currentValue = getValue();

        switch (props.type) {
            case "multiPicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                let postfix = currentValue?.length > 2 ? ` +${ (currentValue.length - 2).toString() } items` : null;
                let isLoading = false;

                const selection = currentValue ? currentValue?.slice(0, 2).map((i: any) => {
                    const item = view.getById(i, null);
                    isLoading = item.isLoading;
                    return item.isLoading ? <TextPlaceholder key={ item.rowKey } color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                }) : ['All'];

                const selectionText = isLoading ? selection : selection.join(', ');
                return { selection: selectionText, postfix };
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                const item = (currentValue !== null && currentValue !== undefined) && view.getById(currentValue, null);
                if (!item) {
                    return { selection: 'All' };
                }
                const selection = item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item) : item.value.name);
                return { selection };
            }
            case "datePicker": {
                return { selection: currentValue ? dayjs(currentValue).format('MMM DD, YYYY') : "Select date" };
            }
            case "rangeDatePicker": {
                if (!currentValue || (!currentValue.from && !currentValue.to)) {
                    return { selection: "Select period" };
                }
                const currentValueFrom = currentValue?.from ? dayjs(currentValue?.from).format('MMM DD, YYYY') : 'Select From';
                const currentValueTo = currentValue?.to ? dayjs(currentValue?.to).format('MMM DD, YYYY') : 'Select To';
                const selection = `${ currentValueFrom } - ${ currentValueTo }`;
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
            modifiers={ [{ name: 'offset', options: { offset: [0, 6] } }] }
        />
    );
};

export const FiltersToolbarItem = React.memo(FiltersToolbarItemImpl);