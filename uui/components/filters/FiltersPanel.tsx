import React, { useCallback, useEffect, useMemo, useState } from "react";
import sortBy from "lodash.sortby";
import { i18n } from "../../i18n";
import { Button, PickerInput, PickerItem, DataPickerRow } from "../../index";
import { DataRowOptions, TableFiltersConfig, FiltersConfig, DataQueryFilter, getOrderBetween, DataTableState, useArrayDataSource } from "@epam/uui-core";
import { PickerTogglerProps, FlexCell } from "@epam/uui-components";
import { FiltersPanelItem } from "./FiltersPanelItem";
import { ReactComponent as addIcon } from '@epam/assets/icons/common/content-plus_bold-18.svg';

export interface FiltersPanelProps<TFilter> {
    filters: TableFiltersConfig<TFilter>[];
    tableState: DataTableState;
    setTableState: (newState: DataTableState) => void;
}

const normalizeFilterWithPredicates = <TFilter, >(filter: TFilter) => {
    if (!filter) {
        return {};
    }
    const result: DataQueryFilter<TFilter> = filter;
    const keys = Object.keys(filter) as (keyof TFilter)[];
    for (let n = 0; n < keys.length; n++) {
        const key = keys[n];
        const filterValue: any = filter[key];
        if (filterValue && typeof filterValue === "object") {
            if ('from' in filterValue && 'to' in filterValue) {
                continue;
            }
            if ('in' in filterValue && (!Array.isArray(filterValue.in) || !filterValue.in.length)) {
                delete filter[key];
            }
            if ('nin' in filterValue && (!Array.isArray(filterValue.nin) || !filterValue.nin.length)) {
                delete filter[key];
            }
            if ('inRange' in filterValue) {
                if (!filterValue.inRange || (!filterValue.inRange.from && !filterValue.inRange.to)) {
                    delete filter[key];
                }
            }
            if ('notInRange' in filterValue) {
                if (!filterValue.notInRange.from && !filterValue.notInRange.to) {
                    delete filter[key];
                }
            }
            Object.keys(filterValue).forEach(predicate => {
                if (filterValue[predicate] === null || filterValue[predicate] === undefined) {
                    delete filter[key];
                }
            });
        }
    }
    return result;
};

const FiltersToolbarImpl = <TFilter extends object>(props: FiltersPanelProps<TFilter>) => {
    const { filters, tableState, setTableState } = props;
    const [newFilterId, setNewFilterId] = useState(null);

    const dataSource = useArrayDataSource({
        items: filters,
        getId: item => item.field,
    }, []);

    const onFiltersChange = (filters: TableFiltersConfig<TFilter>[]) => {
        const newConfig: FiltersConfig = {};
        const newFilter: any = {};

        const sortedOrders = tableState.filtersConfig && sortBy(tableState.filtersConfig, f => f?.order);
        let order: string | null = sortedOrders?.length ? sortedOrders[sortedOrders.length - 1]?.order : null;
        filters.forEach(filter => {
            const newOrder = tableState?.filtersConfig?.[filter?.field]?.order || getOrderBetween(order, null);
            order = newOrder;
            newConfig[filter.field] = { isVisible: true, order: newOrder };

            // Remove unselected filters from filter object
            if (tableState.filter) {
                newFilter[filter.field] = tableState.filter[filter.field];
            }
        });

        setTableState({
            ...tableState,
            filtersConfig: newConfig,
            filter: newFilter,
        });
    };

    const handleFilterChange = (newFilter: TFilter) => {
        const filter = normalizeFilterWithPredicates({...tableState.filter, ...newFilter});
        setTableState({
            ...tableState,
            filter: filter,
        });
    };

    const removeFilter = (field: any) => {
        const filterConfig = { ...tableState.filtersConfig };
        delete filterConfig[field];
        const filter = { ...tableState.filter };
        delete filter[field];

        const newTableState: DataTableState = {
            ...tableState,
            filtersConfig: filterConfig,
            filter: filter,
        };
        setTableState({ ...newTableState });
    };

    const selectedFilters = useMemo(() => {
        const filtersConfig = tableState.filtersConfig || {};
        return filters.filter(filter => {
            return filter.isAlwaysVisible || (filtersConfig[filter?.field] ? filtersConfig[filter?.field].isVisible : false);
        });
    }, [tableState.filtersConfig, filters]);

    const sortedActiveFilters = useMemo(() => {
        return sortBy(selectedFilters, f => tableState.filtersConfig?.[f.field]?.order);
    }, [filters, tableState.filtersConfig]);

    const renderAddFilterToggler = useCallback((props: PickerTogglerProps) => {
        return <Button
            size="36"
            onClick={ props.onClick }
            ref={ props.ref }
            caption={ i18n.filterToolbar.addCaption }
            icon={ addIcon }
            iconPosition="left"
            mode="ghost"
            color="primary"
        />;
    }, []);

    const getRowOptions = useCallback((item: TableFiltersConfig<TFilter>): DataRowOptions<TableFiltersConfig<TFilter>, keyof TFilter> => ({
        isDisabled: item.isAlwaysVisible,
        checkbox: {
            isVisible: true,
            isDisabled: item.isAlwaysVisible,
        },
    }), []);

    useEffect(() => {
        // Reset new filter id, after first render with autofocus
        setNewFilterId(null);
    }, [newFilterId]);

    return (
        <>
            { sortedActiveFilters.map(f => (
                <FlexCell width="auto" key={ f.field as string }>
                    <FiltersPanelItem
                        { ...f }
                        value={ tableState.filter?.[f.field] }
                        onValueChange={ handleFilterChange }
                        key={ f.field as string }
                        autoFocus={ newFilterId === f.field }
                        removeFilter={ removeFilter }
                    />
                </FlexCell>
            )) }
            <PickerInput
                dataSource={ dataSource }
                value={ selectedFilters }
                onValueChange={ onFiltersChange }
                selectionMode="multi"
                valueType="entity"
                key={ newFilterId }
                renderRow={ (props) =>
                    <DataPickerRow
                        { ...props }
                        padding="12"
                        key={ props.key }
                        onCheck={ (row) => { props.onCheck(row); !row.isChecked && setNewFilterId(row.value.field); } }
                        renderItem={ (item, rowProps) => <PickerItem { ...rowProps } title={ item.title } /> }
                    /> }
                getName={ i => i.title }
                renderToggler={ renderAddFilterToggler }
                emptyValue={ [] }
                getRowOptions={ getRowOptions }
                fixedBodyPosition={ true }
            />
        </>
    );
};

export const FiltersPanel = React.memo(FiltersToolbarImpl) as typeof FiltersToolbarImpl;
