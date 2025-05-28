import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { i18n } from '../../i18n';
import { Button } from '../buttons';
import { PickerInput, DataPickerRow } from '../pickers';
import type { DataRowOptions, TableFiltersConfig, FiltersConfig,
    DataTableState, PickerInputElement, Overwrite } from '@epam/uui-core';
import { getOrderBetween, useArrayDataSource, orderBy } from '@epam/uui-core';
import { PickerTogglerProps, FlexCell } from '@epam/uui-components';
import { FiltersPanelItem } from './FiltersPanelItem';
import { UUI_FILTERS_PANEL_ADD_BUTTON, UUI_FILTERS_PANEL_ADD_BUTTON_BODY } from './constants';
import { settings } from '../../settings';
import { normalizeFilterWithPredicates } from './helpers/predicateHelpers';

export interface FiltersPanelModsOverride {}

interface FiltersPanelMods {
    /**
     * Defines size(height) of FilterPanel and filters togglers
     * @default '36'
     */
    size?: '24' | '30' | '36' | '42' | '48';
}

export interface FiltersPanelProps<TFilter> extends
    Overwrite<FiltersPanelMods, FiltersPanelModsOverride> {
    /** Filters config to get data how to render filters */
    filters: TableFiltersConfig<TFilter>[];
    /** Current state value of the table(list) */
    tableState: DataTableState;
    /** Called when state needs to be changed */
    setTableState: (newState: DataTableState) => void;
}

function FiltersToolbarImpl<TFilter extends object>(props: FiltersPanelProps<TFilter>) {
    const { filters, tableState, setTableState, size = (settings.filtersPanel.sizes.default) } = props;
    const [newFilterId, setNewFilterId] = useState(null);

    const pickerInputRef = useRef<PickerInputElement>(null);

    const dataSource = useArrayDataSource(
        {
            items: filters,
            getId: (item) => item.field,
        },
        [],
    );

    const onFiltersChange = (updatedFilters: TableFiltersConfig<TFilter>[]) => {
        const newConfig: FiltersConfig = {};
        const newFilter: any = {};

        const filtersConfig = Object.values(tableState.filtersConfig ?? {});
        const sortedOrders = orderBy(filtersConfig, ({ order }) => order);
        let lastItemOrder: string | null = sortedOrders?.length ? sortedOrders[sortedOrders.length - 1]?.order : null;

        updatedFilters.forEach((filter) => {
            let order = tableState?.filtersConfig?.[filter?.field]?.order;
            if (!order) {
                order = getOrderBetween(lastItemOrder, null);
                lastItemOrder = order;
            }

            newConfig[filter.field] = { isVisible: true, order: order };

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

    const handleFilterChange = (newFilter: TFilter, field: string | number | symbol) => {
        const filter = normalizeFilterWithPredicates({ ...tableState.filter, [field]: newFilter });
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
        return filters.filter((filter) => {
            return filter.isAlwaysVisible || (filtersConfig[filter?.field] ? filtersConfig[filter?.field].isVisible : false);
        });
    }, [tableState.filtersConfig, filters]);

    const sortedActiveFilters = useMemo(() => {
        return orderBy(selectedFilters, (f) => tableState.filtersConfig?.[f.field]?.order);
    }, [filters, tableState.filtersConfig]);

    const renderAddFilterToggler = useCallback((togglerProps: PickerTogglerProps) => {
        return (
            <Button
                size={ size }
                onClick={ togglerProps.onClick }
                ref={ togglerProps.ref }
                caption={ i18n.filterToolbar.addCaption }
                icon={ settings.filtersPanel.icons.addFilterIcon }
                iconPosition="left"
                fill="ghost"
                color="primary"
                cx={ UUI_FILTERS_PANEL_ADD_BUTTON }
            />
        );
    }, []);

    const getRowOptions = useCallback(
        (item: TableFiltersConfig<TFilter>): DataRowOptions<TableFiltersConfig<TFilter>, keyof TFilter> => ({
            isDisabled: item.isAlwaysVisible,
            checkbox: {
                isVisible: true,
                isDisabled: item.isAlwaysVisible,
            },

        }),
        [],
    );

    const isAllFiltersAlwaysVisible = props.filters.every((i) => i.isAlwaysVisible);

    useEffect(() => {
        if (sortedActiveFilters.length && newFilterId && sortedActiveFilters.find(({ field }) => field === newFilterId)) {
            // PickerInput should be closed after filterId update and opening the filter's body.
            // Otherwise, the focus will be not set in the search input of the filter's body.
            pickerInputRef.current?.closePickerBody?.();

            // Reset new filter id, after first render with autofocus
            setNewFilterId(null);
        }
    }, [newFilterId, sortedActiveFilters]);

    return (
        <>
            {sortedActiveFilters.map((f) => (
                <FlexCell width="auto" key={ f.field as string }>
                    <FiltersPanelItem
                        { ...f }
                        value={ tableState.filter?.[f.field] }
                        onValueChange={ (newFilter: TFilter) => handleFilterChange(newFilter, f.field) }
                        key={ f.field as string }
                        autoFocus={ newFilterId === f.field }
                        removeFilter={ removeFilter }
                        size={ size }
                    />
                </FlexCell>
            ))}
            {!isAllFiltersAlwaysVisible && (
                <PickerInput
                    dataSource={ dataSource }
                    value={ selectedFilters }
                    onValueChange={ onFiltersChange }
                    selectionMode="multi"
                    valueType="entity"
                    renderRow={ (props) => (
                        <DataPickerRow
                            { ...props }
                            padding="12"
                            key={ props.key }
                            onCheck={ (row) => {
                                props.onCheck && props.onCheck(row);
                                setNewFilterId(row.value.field);
                            } }
                        />
                    ) }
                    getName={ (i) => i.title }
                    renderToggler={ renderAddFilterToggler }
                    emptyValue={ [] }
                    getRowOptions={ getRowOptions }
                    fixedBodyPosition={ true }
                    size={ size }
                    bodyCx={ UUI_FILTERS_PANEL_ADD_BUTTON_BODY }
                    ref={ pickerInputRef }
                />
            )}
        </>
    );
}

export const FiltersPanel = React.memo(FiltersToolbarImpl) as typeof FiltersToolbarImpl;
