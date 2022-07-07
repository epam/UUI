import React, { useCallback, useMemo, useState } from "react";
import sortBy from "lodash.sortby";
import { Button, FlexRow, PickerInput, PickerItem, DataPickerRow } from "../../index";
import { DataRowOptions, TableFiltersConfig, FiltersConfig, getOrderBetween, DataTableState, useArrayDataSource } from "@epam/uui-core";
import { PickerTogglerProps, FlexCell } from "@epam/uui-components";
import { FiltersToolbarItem } from "./FiltersToolbarItem";
import { ReactComponent as addIcon } from '@epam/assets/icons/common/action-add-18.svg';
import css from './FiltersToolbar.scss';

interface FiltersToolbarProps {
    filters: TableFiltersConfig<any>[];
    tableState: DataTableState;
    setTableState: (newState: DataTableState) => void;
}

const getNewTableState = (key: string, {[key]: deletedKey, ...others}) => others;

const FiltersToolbarImpl = (props: FiltersToolbarProps) => {
    const { filters, tableState, setTableState } = props;
    const [newFilterId, setNewFilterId] = useState(null);

    const dataSource = useArrayDataSource({
        items: filters,
        getId: item => item.columnKey,
    }, []);

    const onFiltersChange = (newValue: TableFiltersConfig<any>[]) => {
        const newConfig: FiltersConfig = {};

        let order: string | null = null;
        newValue.forEach(filter => {
            const newOrder = getOrderBetween(order, null);
            order = newOrder;
            newConfig[filter.columnKey] = { isVisible: true, order: newOrder };
        });

        setTableState({
            ...tableState,
            filtersConfig: newConfig,
        });
    };

    const handleFilterChange = (newFilter: any) => {
        setTableState({
            ...tableState,
            filter: {
                ...tableState.filter,
                ...newFilter,
            },
        });
    };

    const removeFilter = (filterColumnKey: string) => {
        const newTableState = {...tableState, filtersConfig: getNewTableState(filterColumnKey, { ...tableState.filtersConfig })};
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

    const renderToggler = useCallback((props: PickerTogglerProps) => {
        return <Button
            size='36'
            onClick={ props.onClick }
            ref={ props.ref }
            caption="Add filter"
            icon={ addIcon }
            iconPosition='right'
            fill='light'
            color='blue'/>;
    }, []);

    const getRowOptions = useCallback((item: TableFiltersConfig<any>): DataRowOptions<any, any> => ({
        isDisabled: item.isAlwaysVisible,
        checkbox: {
            isVisible: true,
            isDisabled: item.isAlwaysVisible,
        },
    }), []);

    return (
        <FlexRow cx={ css.root } size="36" background="gray5" borderBottom>
            { sortedActiveFilters.map(f => (
                <FlexCell width='auto' key={ f.field as string } >
                    <FiltersToolbarItem
                        { ...f }
                        value={ tableState.filter }
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
                        padding='12'
                        key={ props.key }
                        onCheck={ (row) => { props.onCheck(row); !row.isChecked && setNewFilterId(row.value.columnKey); } }
                        renderItem={ (item, rowProps) => <PickerItem { ...rowProps } title={ item.title } /> }
                    /> }
                getName={ i => i.title }
                renderToggler={ renderToggler }
                emptyValue={ [] }
                getRowOptions={ getRowOptions }
            />
        </FlexRow>
    );
};

export const FiltersToolbar = React.memo(FiltersToolbarImpl) as typeof FiltersToolbarImpl;