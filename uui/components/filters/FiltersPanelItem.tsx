import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { uuiDayjs } from '../../helpers/dayJsHelper';
import cx from 'classnames';
import { Middleware, offset } from '@floating-ui/react';
import {
    DropdownBodyProps,
    TableFiltersConfig,
    IDropdownToggler,
    IEditable,
    isMobile,
    FilterPredicateName,
    getSeparatedValue,
    DataRowProps,
    PickerFilterConfig,
    useForceUpdate,
    IDataSource,
    DataSourceState,
    mobilePositioning,
} from '@epam/uui-core';
import { Dropdown } from '@epam/uui-components';
import { i18n } from '../../i18n';
import { FilterPanelItemToggler } from './FilterPanelItemToggler';
import { LinkButton } from '../buttons';
import { MultiSwitch } from '../inputs';
import { FilterItemBody } from './FilterItemBody';
import { DropdownContainer } from '../overlays';
import { PickerBodyMobileView } from '../pickers';
import { UUI_FILTERS_PANEL_ITEM_BODY } from './constants';
import { settings } from '../../settings';
import css from './FiltersPanelItem.module.scss';

export type FiltersToolbarItemProps = TableFiltersConfig<any> &
IEditable<any> & {
    autoFocus?: boolean;
    removeFilter?: (field: any) => void;
    size?: '24' | '30' | '36' | '42' | '48';
};

function useView(props: FiltersToolbarItemProps, value: any) {
    const forceUpdate = useForceUpdate();

    let useViewFn: IDataSource<any, any, any>['useView'];
    const dataSourceState: DataSourceState = {};
    if (props.type === 'singlePicker' || props.type === 'multiPicker') {
        useViewFn = props.dataSource.useView.bind(props.dataSource);
        if (props.type === 'singlePicker') {
            dataSourceState.selectedId = value;
        }

        if (props.type === 'multiPicker') {
            dataSourceState.checked = value;
        }
    }

    return useViewFn?.(dataSourceState, forceUpdate, { showSelectedOnly: true });
}

function FiltersToolbarItemImpl(props: FiltersToolbarItemProps) {
    const { maxCount = 2 } = props;
    const isPickersType = props?.type === 'multiPicker' || props?.type === 'singlePicker';
    const isMobileScreen = isMobile();
    const floatingMiddleware: Middleware[] = useMemo(() => {
        const middleware: Middleware[] = [
            offset(() => {
                return isPickersType && isMobileScreen ? 0 : 6;
            }),
        ];

        if (isPickersType && isMobileScreen) {
            middleware.push(mobilePositioning);
        }

        return middleware;
    }, [isPickersType]);

    const getDefaultPredicate = () => {
        if (!props.predicates) {
            return null;
        }
        return Object.keys(props.value || {})[0] || props.predicates.find((i) => i.isDefault)?.predicate || props.predicates?.[0].predicate;
    };

    const [isOpen, isOpenChange] = useState(props.autoFocus);
    const [predicate, setPredicate] = useState(getDefaultPredicate());
    const predicateName: string = React.useMemo(() => predicate && props.predicates.find((p) => p.predicate === predicate).name, [predicate]);

    useEffect(() => {
        if (props.predicates && Object.keys(props.value || {})[0] && Object.keys(props.value || {})[0] !== predicate) {
            setPredicate(Object.keys(props.value || {})[0]);
        }
    }, [props.value]);

    const onValueChange = useCallback(
        (value: any) => {
            if (props.predicates) {
                props.onValueChange({ [props.field]: { [predicate]: value } });
            } else {
                props.onValueChange({ [props.field]: value });
            }
        },
        [props.field, props.onValueChange],
    );

    const removeOnclickHandler = () => {
        props.removeFilter(props.field);
    };

    const changePredicate = (val: FilterPredicateName) => {
        const isInRange = (p: FilterPredicateName) => p === 'inRange' || p === 'notInRange';
        if (props.type === 'numeric') {
            let predicateValue = {
                [props.field]: { [val]: getValue() },
            };
            if (isInRange(val) && !isInRange(predicate as FilterPredicateName)) {
                // from simple predicate -> to Range
                predicateValue = { [props.field]: { [val]: { from: null, to: null } } };
            } else if (!isInRange(val) && isInRange(predicate as FilterPredicateName)) {
                // from Range -> to simple predicate
                predicateValue = { [props.field]: { [val]: null } };
            }
            props.onValueChange(predicateValue);
        } else {
            props.onValueChange({ [props.field]: { [val]: getValue() } });
        }
        setPredicate(val);
    };

    const renderHeader = (hideTitle: boolean) => (
        <div className={ cx(css.header, isPickersType && (props.showSearch ?? css.withSearch)) }>
            {props.predicates ? (
                <MultiSwitch
                    items={ props.predicates.map((i) => ({ id: i.predicate, caption: i.name })) }
                    value={ predicate }
                    onValueChange={ changePredicate }
                    size={ settings.filtersPanel.sizes.pickerBodyMultiSwitch }
                />
            ) : (
                !hideTitle && (
                    <div className={ css.title }>
                        {props.title}
                    </div>
                )
            )}
            {!props?.isAlwaysVisible && (
                <LinkButton
                    cx={ css.removeButton }
                    caption={ i18n.filterToolbar.datePicker.removeCaption }
                    onClick={ removeOnclickHandler }
                    size={ settings.filtersPanel.sizes.pickerBodyLinkButton }
                    icon={ settings.filtersPanel.icons.pickerBodyRemoveIcon }
                />
            )}
        </div>
    );

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        const hideHeaderTitle = isPickersType && isMobileScreen;
        return isPickersType ? (
            <PickerBodyMobileView
                { ...dropdownProps }
                cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] }
                title={ props.title }
                width={ settings.filtersPanel.sizes.pickerBodyMinWidth }
                onClose={ () => isOpenChange(false) }
            >
                { renderHeader(hideHeaderTitle) }
                <FilterItemBody
                    { ...props }
                    { ...dropdownProps }
                    selectedPredicate={ predicate }
                    value={ getValue() }
                    onValueChange={ onValueChange }
                />
            </PickerBodyMobileView>
        ) : (
            <DropdownContainer cx={ [css.body, UUI_FILTERS_PANEL_ITEM_BODY] } { ...dropdownProps }>
                { renderHeader(hideHeaderTitle) }
                <FilterItemBody
                    { ...props }
                    { ...dropdownProps }
                    selectedPredicate={ predicate }
                    value={ getValue() }
                    onValueChange={ onValueChange }
                />
            </DropdownContainer>
        );
    };

    const getValue = () => {
        return predicate ? props.value?.[predicate] : props.value;
    };

    const getPickerItemName = (item: DataRowProps<any, any>, config: PickerFilterConfig<any>) => {
        if (item.isLoading) {
            return settings.filtersPanel.renderPlaceholder();
        }

        if (item.isUnknown) {
            return 'Unknown';
        }

        return config.getName ? config.getName(item.value) : item.value.name;
    };

    const view = useView(props, getValue());

    const getTogglerValue = () => {
        const currentValue = getValue();
        const defaultFormat = 'MMM DD, YYYY';

        switch (props.type) {
            case 'multiPicker': {
                let isLoading = false;
                const selection = currentValue
                    ? currentValue?.slice(0, maxCount).map((i: any) => {
                        const item = view.getById(i, null);
                        isLoading = item?.isLoading;
                        return getPickerItemName(item, props);
                    })
                    : currentValue;

                const postfix = (!isLoading && currentValue?.length > maxCount) ? ` +${(currentValue.length - maxCount).toString()} ${i18n.filterToolbar.pickerInput.itemsPlaceholder}` : null;
                return { selection, postfix };
            }
            case 'numeric': {
                const isRangePredicate = predicate === 'inRange' || predicate === 'notInRange';
                const decimalFormat = (val: number) => getSeparatedValue(val, { maximumFractionDigits: 2 });
                if ((isRangePredicate && !currentValue) || (!isRangePredicate && !currentValue && currentValue !== 0)) {
                    return { selection: undefined };
                }
                const selection = isRangePredicate
                    ? `${!currentValue?.from && currentValue?.from !== 0 ? 'Min' : decimalFormat(currentValue?.from)} - ${
                        !currentValue?.to && currentValue?.to !== 0 ? 'Max' : decimalFormat(currentValue?.to)
                    }`
                    : `${!currentValue && currentValue !== 0 ? 'ALL' : decimalFormat(currentValue)}`;
                return { selection: [selection] };
            }
            case 'singlePicker': {
                if (currentValue === null || currentValue === undefined) {
                    return { selection: undefined };
                }

                const item = view.getById(currentValue, null);
                const selection = getPickerItemName(item, props);

                return { selection: [selection] };
            }
            case 'datePicker': {
                return { selection: currentValue ? [uuiDayjs.dayjs(currentValue).format(props.format || defaultFormat)] : currentValue };
            }
            case 'rangeDatePicker': {
                if (!currentValue || (!currentValue.from && !currentValue.to)) {
                    return { selection: undefined };
                }
                const currentValueFrom = currentValue?.from
                    ? uuiDayjs.dayjs(currentValue?.from).format(props.format || defaultFormat)
                    : i18n.filterToolbar.rangeDatePicker.emptyPlaceholderFrom;
                const currentValueTo = currentValue?.to
                    ? uuiDayjs.dayjs(currentValue?.to).format(props.format || defaultFormat)
                    : i18n.filterToolbar.rangeDatePicker.emptyPlaceholderTo;
                const selection = `${currentValueFrom} - ${currentValueTo}`;
                return { selection: [selection] };
            }
            case 'custom': {
                const value = props.getTogglerValue(props);
                return { selection: value !== undefined ? [value] : undefined };
            }
        }
    };

    const getTogglerWidth = () => {
        if (props.togglerWidth) return props.togglerWidth;

        return props.type === 'datePicker' || props.type === 'rangeDatePicker' ? null : 300;
    };

    const renderTarget = (dropdownProps: IDropdownToggler) => (
        <FilterPanelItemToggler
            { ...dropdownProps }
            { ...getTogglerValue() }
            title={ props.title }
            predicateName={ props.value ? predicateName : null }
            maxWidth={ getTogglerWidth() }
            size={ props.size }
        />
    );

    return (
        <Dropdown
            renderTarget={ renderTarget }
            renderBody={ renderBody }
            closeBodyOnTogglerHidden={ !isMobile() }
            value={ isOpen }
            onValueChange={ isOpenChange }
            middleware={ floatingMiddleware }
        />
    );
}

export const FiltersPanelItem = React.memo(FiltersToolbarItemImpl);
