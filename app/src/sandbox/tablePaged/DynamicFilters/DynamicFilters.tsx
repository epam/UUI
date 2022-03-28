import React, { useCallback, useMemo, useRef, useState } from "react";
import sortBy from 'lodash.sortby';
import { Button, FlexRow, PickerInput } from "@epam/promo";
import { FilterConfig, FiltersConfig, getOrderBetween, ITableState } from "@epam/uui-core";
import { DynamicFilter } from "./DynamicFilter";

interface DynamicFiltersProps<TFilter extends Record<string, any>> {
    dataSource: any;
    filters: FilterConfig<TFilter>[];
    filter: TFilter;
    onFilterChange: ITableState["setFilter"];
    filtersConfig: FiltersConfig;
    setFiltersConfig(config: FiltersConfig): void;
}

const DynamicFiltersImpl = <TFilter extends Record<string, any>>(props: DynamicFiltersProps<TFilter>) => {
    const {filters, dataSource, filter, onFilterChange, filtersConfig, setFiltersConfig} = props;
    const [value, setValue] = useState(null);
    const order = useRef<string | null>(null);
    
    const onChange = useCallback((newValue: any[]) => {
        setValue(newValue); 
        
        const newActiveFilterKeys = newValue.map(nv => nv.key);
        const newConfig = {...filtersConfig};

        newActiveFilterKeys.forEach(key => {
            const newOrder = getOrderBetween(order.current, null);
            order.current = newOrder;
            newConfig[key] = { ...filtersConfig[key], isVisible: true, order: newOrder};
        });
        Object.keys(newConfig).forEach(key => {
            if (!newActiveFilterKeys.includes(key)) newConfig[key].isVisible = false;
        });
        
        setFiltersConfig(newConfig);
    }, [filtersConfig]);
 
    const handleFilterChange = useCallback((newFilter: any) => {
        onFilterChange({
            ...filter,
            ...newFilter,
        });
    }, [filter]);
    
    const activeFilters = useMemo(() => {
        const newFilters = filters.filter(f => filtersConfig[f.columnKey]?.isVisible);
        return sortBy(newFilters, f => filtersConfig[f.columnKey]?.order);
    }, [filters, filtersConfig]);
    
    return (
        <FlexRow size="36" padding="12" background="gray5" borderBottom>
            <PickerInput
                dataSource={ dataSource }
                value={ value } 
                onValueChange={ onChange }
                selectionMode="multi"
                valueType="entity"
                getName={ i => i.caption }
                editMode="modal"
            />

            { activeFilters.map(f => (
                <DynamicFilter
                    value={ filter }
                    onValueChange={ handleFilterChange }
                    filterConfig={ f as any }
                    key={ f.field as string }
                />
            )) }
        </FlexRow>
    );
};

export const DynamicFilters = React.memo(DynamicFiltersImpl) as typeof DynamicFiltersImpl;