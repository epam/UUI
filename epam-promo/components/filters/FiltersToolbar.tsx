import React, { useCallback, useMemo, useState } from "react";
import sortBy from "lodash.sortby";
import { Button, PickerInput, PickerItem, DataPickerRow } from "../../index";
import { DataRowOptions, TableFiltersConfig, FiltersConfig, getOrderBetween, DataTableState, useArrayDataSource } from "@epam/uui-core";
import { PickerTogglerProps, FlexCell } from "@epam/uui-components";
import { FiltersToolbarItem } from "./FiltersToolbarItem";
import { ReactComponent as addIcon } from '@epam/assets/icons/common/content-plus_bold-18.svg';

interface FiltersToolbarProps<TFilter> {
    filters: TableFiltersConfig<TFilter>[];
    tableState: DataTableState;
    setTableState: (newState: DataTableState) => void;
}

const getNewTableState = (key: string, { [key]: deletedKey, ...others }) => others;

const FiltersToolbarImpl = <TFilter extends object>(props: FiltersToolbarProps<TFilter>) => {
    const { filters, tableState, setTableState } = props;
    const [newFilterId, setNewFilterId] = useState(null);

    const dataSource = useArrayDataSource({
        items: filters,
        getId: item => item.columnKey,
    }, []);

    const onFiltersChange = (filters: TableFiltersConfig<TFilter>[]) => {
        const newConfig: FiltersConfig = {};
        const sortedOrders = tableState.filtersConfig && sortBy(tableState.filtersConfig, f => f?.order);
        let order: string | null = sortedOrders ? sortedOrders[sortedOrders.length - 1].order : null;
        filters.forEach(filter => {
            if (tableState.filtersConfig && tableState?.filtersConfig[filter?.columnKey]) {
                newConfig[filter.columnKey] = tableState?.filtersConfig[filter?.columnKey];
            } else {
                const newOrder = getOrderBetween(order, null);
                order = newOrder;
                newConfig[filter.columnKey] = { isVisible: true, order: newOrder };
            }
        });

        setTableState({
            ...tableState,
            filtersConfig: newConfig,
        });
    };

    const handleFilterChange = (newFilter: TFilter) => {
        setTableState({
            ...tableState,
            filter: {
                ...tableState.filter,
                ...newFilter,
            },
        });
    };

    const removeFilter = (filterColumnKey: string, field: any) => {
        const newTableState: DataTableState = {
            ...tableState,
            filtersConfig: getNewTableState(filterColumnKey, { ...tableState.filtersConfig }),
            filter: {
                ...tableState.filter,
                [field]: undefined,
            },
        };
        setTableState({ ...newTableState });
    };

    const selectedFilters = useMemo(() => {
        const filtersConfig = tableState.filtersConfig || {};
        return filters.filter(filter => {
            return filter.isAlwaysVisible || (filtersConfig[filter?.columnKey] ? filtersConfig[filter?.columnKey].isVisible : false);
        });
    }, [tableState.filtersConfig, filters]);

    const sortedActiveFilters = useMemo(() => {
        return sortBy(selectedFilters, f => tableState.filtersConfig?.[f.columnKey]?.order);
    }, [filters, tableState.filtersConfig]);

    const renderAddFilterToggler = useCallback((props: PickerTogglerProps) => {
        return <Button
            size="36"
            onClick={ props.onClick }
            ref={ props.ref }
            caption="Add filter"
            icon={ addIcon }
            iconPosition="left"
            fill="light"
            color="blue"
        />;
    }, []);

    const getRowOptions = useCallback((item: TableFiltersConfig<any>): DataRowOptions<any, any> => ({
        isDisabled: item.isAlwaysVisible,
        checkbox: {
            isVisible: true,
            isDisabled: item.isAlwaysVisible,
        },
    }), []);

    return (
        <>
            { sortedActiveFilters.map(f => (
                <FlexCell width="auto" key={ f.field as string }>
                    <FiltersToolbarItem
                        { ...f }
                        value={ tableState.filter?.[f.field] }
                        onValueChange={ handleFilterChange }
                        key={ f.field as string }
                        autoFocus={ newFilterId === f.columnKey }
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
                        onCheck={ (row) => { props.onCheck(row); !row.isChecked && setNewFilterId(row.value.columnKey); } }
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

export const FiltersToolbar = React.memo(FiltersToolbarImpl) as typeof FiltersToolbarImpl;