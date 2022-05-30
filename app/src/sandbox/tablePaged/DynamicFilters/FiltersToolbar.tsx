import React, { useCallback, useEffect, useMemo, useState } from "react";
import css from "./DynamicFilters.scss";
import sortBy from "lodash.sortby";
import { Button, FlexRow, PickerInput } from "@epam/promo";
import { DataRowOptions, FilterConfig, FiltersConfig, getOrderBetween, ITableState, useArrayDataSource } from "@epam/uui-core";
import { PickerTogglerProps } from "@epam/uui-components";
import { FiltersToolbarItem } from "./FiltersToolbarItem";

interface FiltersToolbarProps<TFilter extends Record<string, any>> {
    filters: FilterConfig<TFilter>[];
    tableState: ITableState["tableState"];
    setTableState: ITableState["setTableState"];
}

const FiltersToolbarImpl = <TFilter extends Record<string, any>>(props: FiltersToolbarProps<TFilter>) => {
    const { filters, tableState, setTableState } = props;
    
    // const [value, setValue] = useState([]);
    const alwaysVisibleFilters = useMemo(() => filters.filter(f => f.isAlwaysVisible), [filters]);

    const dataSource = useArrayDataSource({
        items: filters.map(f => ({ ...f, id: f.columnKey })),
    }, []);

    const onChange = useCallback((newValue: FilterConfig<TFilter>[]) => {
        const newActiveFilterKeys = newValue.map(nv => nv.columnKey);
        const newConfig = {} as FiltersConfig;

        let order: string | null = null;
        newActiveFilterKeys.forEach(key => {
            if (filters.find(f => f.columnKey === key)?.isAlwaysVisible) {
                newConfig[key] = tableState.filtersConfig?.[key]
                    ?? { isVisible: true, order: getOrderBetween(null, null) };
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

    const pickerValue = useMemo(() => {
        let result;
        if (!tableState.filtersConfig) {
            result = alwaysVisibleFilters;
        } else {
            const activeFilters = Object.keys(tableState.filtersConfig);
            result = filters.filter(f => {
                return alwaysVisibleFilters.find(avf => avf.columnKey === f.columnKey) || activeFilters.includes(f.columnKey);
            });
        }
        return result.map(f => ({ ...f, id: f.columnKey }));
    }, [tableState.filtersConfig, alwaysVisibleFilters]);
    
    const handleFilterChange = useCallback((newFilter: any) => {
        setTableState({
            ...tableState,
            filter: {
                ...tableState.filter,
                ...newFilter,
            },
        });
    }, [tableState, setTableState]);

    const activeFilters = useMemo((): FilterConfig<TFilter>[] => {
        const newFilters = filters.filter(f => {
            return alwaysVisibleFilters.find(avf => avf.columnKey === f.columnKey)
                || tableState.filtersConfig?.[f.columnKey]?.isVisible;
        });
        return sortBy(newFilters, f => tableState.filtersConfig?.[f.columnKey]?.order);
    }, [filters, tableState.filtersConfig]);

    const renderToggler = useCallback((props: PickerTogglerProps) => {
        return <Button caption="Choose filter" onClick={ props.onClick }/>;
    }, []);

    const getRowOptions = useCallback((item: FilterConfig<TFilter>): DataRowOptions<any, any> => ({
        isDisabled: item.isAlwaysVisible,
        checkbox: {
            isVisible: true,
            isDisabled: item.isAlwaysVisible,
        },
    }), []);

    return (
        <FlexRow size="36" background="gray5" vPadding="12" padding="6" cx={ css.filters } borderBottom>
            <div className={ css.cell }>
                <PickerInput
                    dataSource={ dataSource }
                    value={ pickerValue }
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
                <FiltersToolbarItem
                    { ...f }
                    value={ tableState.filter }
                    onValueChange={ handleFilterChange }
                    key={ f.field as string }
                />
            )) }
        </FlexRow>
    );
};

export const FiltersToolbar = React.memo(FiltersToolbarImpl) as typeof FiltersToolbarImpl;