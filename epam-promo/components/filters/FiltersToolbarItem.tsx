import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import cx from "classnames";
import { TableFiltersConfig, IDropdownToggler, IEditable, isMobile, useForceUpdate, FilterPredicateName } from "@epam/uui-core";
import { Dropdown, DropdownBodyProps } from "@epam/uui-components";
import { i18n } from "../../i18n";
import { FilterToolbarItemToggler } from "./FilterToolbarItemToggler";
import { Panel } from "../layout";
import { LinkButton } from "../buttons";
import { MultiSwitch } from "../inputs";
import { Text, TextPlaceholder } from "../typography";
import { FilterItemBody } from "./FilterItemBody";
import { DropdownContainer } from "../overlays";
import { ReactComponent as RemoveIcon } from "@epam/assets/icons/common/action-deleteforever-12.svg";
import css from "./FiltersToolbarItem.scss";

export type FiltersToolbarItemProps = TableFiltersConfig<any> & IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (columnKey: string, field: any) => void;
};

const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps) => {
    const currentPredicate = props.value ? Object.keys(props.value)[0] : null;
    const predicateName: string | null = currentPredicate && props?.predicates ? props.predicates.filter(p => p.predicate === Object.keys(props.value)[0])[0].name : null;

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
            { !props?.isAlwaysVisible && (
                <LinkButton
                    cx={ css.removeButton }
                    caption={ i18n.filterToolbar.datePicker.removeCaption }
                    onClick={ removeOnclickHandler }
                    size="24"
                    icon={ RemoveIcon }/>
            ) }
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
        const defaultFormat = "MMM DD, YYYY";
        const maxWidth = '300';

        switch (props.type) {
            case "multiPicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                let postfix = currentValue?.length > 2 ? ` +${ (currentValue.length - 2).toString() } ${i18n.filterToolbar.pickerInput.itemsPlaceholder}` : null;
                let isLoading = false;

                const selection = currentValue ? currentValue?.slice(0, 2).map((i: any) => {
                    const item = view.getById(i, null);
                    isLoading = item.isLoading;
                    return item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item.value) : item.value.name);
                }) : [i18n.filterToolbar.pickerInput.emptyValueCaption];

                const selectionText = isLoading ? selection : selection.join(', ');
                return { selection: selectionText, postfix, maxWidth };
            }
            case "singlePicker": {
                const view = props.dataSource.getView({}, forceUpdate);
                const item = (currentValue !== null && currentValue !== undefined) && view.getById(currentValue, null);
                if (!item) {
                    return { selection: i18n.filterToolbar.pickerInput.emptyValueCaption };
                }
                const selection = item.isLoading ? <TextPlaceholder color="gray40"/> : (props.getName ? props.getName(item.value) : item.value.name);
                return { selection, maxWidth };
            }
            case "datePicker": {
                return { selection: currentValue ? dayjs(currentValue).format(props.format || defaultFormat) : i18n.filterToolbar.datePicker.placeholder };
            }
            case "rangeDatePicker": {
                if (!currentValue || (!currentValue.from && !currentValue.to)) {
                    return { selection: i18n.filterToolbar.rangeDatePicker.emptyPickerPlaceholder };
                }
                const currentValueFrom = currentValue?.from ? dayjs(currentValue?.from).format(props.format || defaultFormat) : i18n.filterToolbar.rangeDatePicker.emptyPlaceholderFrom;
                const currentValueTo = currentValue?.to ? dayjs(currentValue?.to).format(props.format || defaultFormat) : i18n.filterToolbar.rangeDatePicker.emptyPlaceholderTo;
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
            predicateName={ predicateName }
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
