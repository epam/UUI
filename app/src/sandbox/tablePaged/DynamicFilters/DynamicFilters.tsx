import React, { useCallback, useMemo, useState } from "react";
import css from "./DynamicFilters.scss";
import sortBy from "lodash.sortby";
import { Button, FlexRow, PickerInput } from "@epam/promo";
import { DataRowOptions, FilterConfig, FiltersConfig, getOrderBetween, ITableState, useArrayDataSource } from "@epam/uui-core";
import { PickerTogglerProps } from "@epam/uui-components";
import { DynamicFilter } from "./DynamicFilter";

interface DynamicFiltersProps<TFilter extends Record<string, any>> {
    filters: FilterConfig<TFilter>[];
    tableState: ITableState["tableState"];
    setTableState: ITableState["setTableState"];
}

const DynamicFiltersImpl = <TFilter extends Record<string, any>>(props: DynamicFiltersProps<TFilter>) => {
    const { filters, tableState, setTableState } = props;
    
    const mapFilterToPickerValue = useCallback((f: FilterConfig<TFilter>) => {
        return {
            id: f.columnKey,
            columnKey: f.columnKey,
            title: f.title,
            isDisabled: tableState.filtersConfig[f.columnKey]?.isAlwaysVisible,
        };
    }, [tableState.filtersConfig]);
    
    const [value, setValue] = useState(() => {
        const activeFilters = Object.keys(tableState.filtersConfig);
        return filters.filter(f => activeFilters.includes(f.columnKey)).map(mapFilterToPickerValue);
    });

    const filterItems = useMemo(() => {
        return filters.map(mapFilterToPickerValue);
    }, [filters, mapFilterToPickerValue]);

    const dataSource = useArrayDataSource({
        items: filterItems,
    }, []);
    
    const onChange = useCallback((newValue: typeof filterItems) => {
        setValue(newValue);

        const newActiveFilterKeys = newValue.map(nv => nv.columnKey);
        const newConfig = {} as FiltersConfig;

        let order: string | null = null;
        newActiveFilterKeys.forEach(key => {
            if (tableState.filtersConfig[key]?.isAlwaysVisible) {
                newConfig[key] = tableState.filtersConfig[key];
                return;
            }
            
            const newOrder = getOrderBetween(order, null);
            order = newOrder;
            newConfig[key] = { isVisible: true, order: newOrder };
        });
        
        setTableState({
            ...tableState,
            filtersConfig: newConfig,
        });
    }, [tableState, setTableState]);

    const handleFilterChange = useCallback((newFilter: any) => {
        const result = {
            ...tableState.filter,
            ...newFilter,
        };
        Object.keys(result).forEach(key => {
            if (result[key] === undefined) delete result[key];
        });
        setTableState({
            ...tableState,
            filter: result,
        });
    }, [tableState, setTableState]);

    const activeFilters = useMemo((): FilterConfig<TFilter>[] => {
        const newFilters = filters.filter(f => tableState.filtersConfig[f.columnKey]?.isVisible);
        return sortBy(newFilters, f => tableState.filtersConfig[f.columnKey]?.order);
    }, [filters, tableState.filtersConfig]);

    const renderToggler = useCallback((props: PickerTogglerProps) => {
        return <Button caption="Choose filter" onClick={ props.onClick }/>;
    }, []);
    
    const getRowOptions = useCallback((item: typeof filterItems[number]): DataRowOptions<any, any> => ({
        isDisabled: item.isDisabled,
        checkbox: {
            isVisible: true,
            isDisabled: item.isDisabled,
        },
    }), []);

    return (
        <FlexRow size="36" background="gray5" vPadding="12" padding="6" cx={ css.filters } borderBottom>
            <div className={ css.cell }>
                <PickerInput
                    dataSource={ dataSource }
                    value={ value }
                    onValueChange={ onChange }
                    selectionMode="multi"
                    valueType="entity"
                    getName={ i => i.title }
                    editMode="modal"
                    renderToggler={ renderToggler }
                    emptyValue={ [] }
                    getRowOptions={ getRowOptions }
                />
            </div>

            { activeFilters.map(f => (
                <DynamicFilter
                    { ...f }
                    value={ tableState.filter }
                    onValueChange={ handleFilterChange }
                    key={ f.field as string }
                />
            )) }
        </FlexRow>
    );
};

export const DynamicFilters = React.memo(DynamicFiltersImpl) as typeof DynamicFiltersImpl;